const Models = require('../models/index')

class SocialMediaController {
    static async Create (req, res, next) {
        const {id} = req.user
        try {
            const {name, social_media_url} = req.body
            const socialMedia = await Models.SocialMedia.create({name, social_media_url, UserId : id})
            return res.status(201).json({
                social_media : socialMedia
            })
        } catch (err) {
            return res.status(500).json(`${err}. Please try again`)
        }
    }
    static async Update (req, res, next) {
        const {id} = req.user
        try {
            const {socialMediaId} = req.params
            const {name, social_media_url} = req.body
            const validateSocialMediaOwner = await Models.SocialMedia.findOne({where : {id : socialMediaId, UserId : id}})
            if(!validateSocialMediaOwner) return res.status(303).json("not found")
            await Models.SocialMedia.update({name, social_media_url}, {where : {id : socialMediaId}})
            const socialMedia = await Models.SocialMedia.findOne({where : {id : socialMediaId}})
            return res.status(201).json({
                social_media : socialMedia
            })
        } catch (err) {
             return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Delete (req, res, next) {
        const {id} = req.user
        try {
            const {socialMediaId} = req.params
            const validateSocialMediaOwner = await Models.SocialMedia.findOne({where : {id : socialMediaId, UserId : id}})
            if(!validateSocialMediaOwner) return res.status(303).json("not found")
            const socialMedia = await Models.SocialMedia.destroy({where : {id : socialMediaId, UserId : id}})
            if(!socialMedia) return res.status(404).json("not found")
            return res.status(200).json({
                message : 'Your sosial media has been successfully deleted'
            })
        } catch (err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Get(req, res, next) {
        const {id} =req.user
        try {
            const socialMedia = await Models.SocialMedia.findAll({where : {UserId : id}, include : [
                {
                    model : Models.User,
                    attributes: ['id', 'username', 'profile_image_url'],
                }
            ] })

            return res.status(200).json({
                SocialMedias : socialMedia
            })
        } catch (err) {
             return res.status(500).json(`${err.message}. Please try again`) 
        }
    }

}

module.exports = SocialMediaController