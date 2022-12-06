
const Models = require('../models/index')
const {User} = require('../models/index')

class PhotosController {
    static async Create (req, res, next) {
        const {id} = req.user
        try {
            const {poster_image_url, title, caption} = req.body
            const Photo = await Models.Photo.create({title, caption, poster_image_url, UserId : id})
             return res.status(201).json({
                    id : Photo.id,
                    poster_image_url : Photo.poster_image_url,
                    title : Photo.title,
                    caption : Photo.caption,
                    UserId : Photo.UserId,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Update (req, res, next) {
        const {id} = req.user
        try {
            const {photoId} = req.params
            const validateOwnerPhoto = await Models.Photo.findOne({where : {UserId : id, id : photoId}})
            if(!validateOwnerPhoto) return res.status(400).json("anda tidak memiliki akses")
            await Models.Photo.update(req.body, {where : {id : photoId}})
            const Photo = await Models.Photo.findOne({where : {id : photoId}})
             return res.status(201).json({
                    Photo : Photo
            })
        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Delete (req, res, next) {
        const {id} = req.user
        try {
            const {photoId} = req.params
            const validateOwnerPhoto = await Models.Photo.findOne({where : {UserId : id}})
            if(!validateOwnerPhoto) return res.status(400).json("anda tidak memiliki akses")
            const Photo = await Models.Photo.destroy({where : {id : photoId, UserId : id}})
            if(!Photo) return res.status(404).json("NOT FOUND")
            return res.status(200).json({
                message : 'Your photo has been successfully deleted'
            })
        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Get (req, res, next) {
        const {id} = req.user
        try {
            const Photo = await Models.Photo.findAll({where : {UserId : id}, include : [
               {
                 model : Models.Comment,
                    attributes: ['comment'],
                    as : 'Comments',
                    include : {
                        model :Models.User,
                        attributes : ['username'],
                        as : 'User'
                    },
               },
               {
                model : Models.User,
                attributes: ['id', 'username', 'profile_image_url'],
                as : 'User'
               }
            ]})
             return res.status(200).json({
                message : Photo
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

}

module.exports = PhotosController