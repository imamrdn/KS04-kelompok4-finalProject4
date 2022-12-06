const Models = require('../models/index')

const {hash, compare} = require('../helpers/Hash')
const {sign} = require('../helpers/Jwt')

class UsersController {
    static async Register (req, res, next) {
        let {full_name, email, username, password, profile_image_url, age, phone_number} = req.body
        try {
            password = hash(password)
            const validateEmail = await Models.User.findOne({where : {email : email}})
            if(validateEmail) return res.status(400).json({
                message : "Email Already Registered!"
            })
            const validateUsername = await Models.User.findOne({where : {username : username}})
            if(validateUsername) return res.status(400).json({
                message : "Username Already Registered!"
            })
            const validatePhoneNumber = await Models.User.findOne({where : {phone_number  : phone_number}})
            if(validatePhoneNumber) return res.status(400).json({
                message : "Phone Number Already Registered"
            })
            const User = await Models.User.create({full_name, email, username, password, profile_image_url, age, phone_number})
            return res.status(201).json({
                User : {
                    email : User.email,
                    full_name : User.full_name,
                    username : User.username,
                    profile_image_url : User.profile_image_url,
                    age : User.age,
                    phone_number : User.phone_number
                }
            })
        } catch(err) {
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Login (req, res, next) {
        try {
            const {email, password} = req.body
            const validateEmail = await Models.User.findOne({where : {email : email}, attributes: ["id", "password"]})
            if(!validateEmail) return res.status(404).json("Email Not Registered")
            if(!compare(password, validateEmail.password)) return res.status(404).json("Password Not Found")
            const Token = await sign({id : validateEmail.id, email : email})
            return res.status(200).json({
                token : Token
            })
        }catch(err){
            return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async Update (req, res, next) {
        const {id} = req.user
        const {usersId} = req.params
        try {
            if(id != usersId) return res.status(400).json({message :  "Tidak punya akses"})
            await Models.User.update(req.body, {where : {id : id}})
            const User = await Models.User.findOne({where : {id :id} })
            return res.status(201).json({
                User : {
                    email : User.email,
                    full_name : User.full_name,
                    username : User.username,
                    profile_image_url : User.profile_image_url,
                    age : User.age,
                    phone_number : User.phone_number
                }
            })
        }catch(err){
             return res.status(500).json({
                message : "Please Try again",
                errorMessage : err.message
             })
        }
    }

    static async Delete (req, res, next) {
        const {id} = req.user
         const {usersId} = req.params
        try {
            if(id != usersId) return res.status(400).json({message :  "Tidak punya akses"})
            const User = await Models.User.destroy({where : {id : id}})
            return res.status(200).json({
                message : "Your account has been successfully deleted"
            })
        }catch(err){
           return res.status(500).json(`${err.message}. Please try again`)
        }
    }

    static async 
}

module.exports = UsersController