const Models = require('../models/index')

class CommentsController {
    static async Create (req, res, next) {
        const {id} = req.user
        try {
            const {comment, PhotoId} = req.body
            const Comment = await Models.Comment.create({comment, PhotoId, UserId : id})
            return res.status(201).json({
                comment : Comment
            })

        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Update (req, res, next) {
        const {id} = req.user
        try {
            const {commentId} = req.params
            const {comment} = req.body
            const validateOwnerComment = await Models.Comment.findOne({where : {userId : id, id : commentId}})
            if(!validateOwnerComment) return res.status(400).json("anda tidak memiliki akses")
            await Models.Comment.update({comment},{Where : {id : commentId}})
            const Comment = await Models.Comment.findOne({where : {id : commentId}})
            return res.status(200).json({
                comment : Comment
            })
        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Delete (req, res, next) {
        const {id} = req.user
        try {
            const {commentId} = req.params
             const validateOwnerComment = await Models.Comment.findOne({where : {UserId : id, id : commentId}})
            if(!validateOwnerComment) return res.status(400).json("anda tidak memiliki akses")
            const Comment = await Models.Comment.destroy({where : {id : commentId}})
            if(!Comment) return res.status(404).json("not found")
            return res.status(200).json({
                message : "Your comment has been successfully deleted"
            })
        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Get (req, res, next) {
        const {id} = req.user
        try {
            const Comment = await Models.Comment.findAll({where : {UserId : id}, include : [
                {
                    model : Models.Photo,
                    attributes: ['id', 'title', 'caption', 'poster_image_url'],
                },
                {
                    model : Models.User,
                    attributes: ['id', 'username', 'profile_image_url', 'phone_number'],
                }
            ]})
            if(!Comment) return res.status(400).json("not found")
            return res.status(200).json({
                comments : Comment
            })
        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

}

module.exports = CommentsController