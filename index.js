// import dependencies
const express = require('express')
const {config} = require('dotenv').config()

// import file router
const Users = require('./routes/UsersRouter')
const Photos = require('./routes/PhotosRouter')
const Comments = require('./routes/CommentsRouter')
const socialMedias = require('./routes/SocialMediaRouter')

// import middleware
const authenticationMiddleware = require('./middlewares/AuthenticationMiddleware')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/users', Users)
//pasang middleware untuk photo, comment dan sosial media
app.use(authenticationMiddleware)
app.use('/photos', Photos)
app.use('/comments', Comments)
app.use('/socialmedias', socialMedias)


//app.listen(process.env.PORT, () => {
  //console.log(`Base URL : localhost:${process.env.PORT}`)
//})

module.exports = app