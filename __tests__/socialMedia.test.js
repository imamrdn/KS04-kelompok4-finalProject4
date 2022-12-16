const request = require('supertest')
const { sequelize } = require('../models/index')
const { queryInterface } = sequelize
const app = require('../index')
const {hash, compare} = require('../helpers/Hash')
const { sign, verify } = require('../helpers/Jwt')

let user = {
    full_name : 'aswar', 
    email : 'aswar@gmail.com', 
    username : 'aswar', 
    password : '12345678', 
    profile_image_url : 'http://image.com/defaultphoto.png', 
    age : 20, 
    phone_number : '085123456789',
    createdAt: new Date(),
    updatedAt: new Date()
}
let user2 = {
    full_name : 'aswar', 
    email : '2aswar@gmail.com', 
    username : '2aswar', 
    password : '12345678', 
    profile_image_url : 'http://image.com/defaultphoto.png', 
    age : 20, 
    phone_number : '085123456788',
    createdAt: new Date(),
    updatedAt: new Date()
}
const socialMedia = {
    name : "poto saya",
    social_media_url : 'http://image.com/defaultphoto.png',
    UserId : 1
}


const userToken = sign({ id: 1, email: user.email })
const userToken2 = sign({ id: 2, email: user2.email })

beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await queryInterface.bulkDelete('SocialMedia', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  user.password = hash(user.password);
   await queryInterface.bulkInsert('Users', [user, user2])
})

//POST socialMedia
describe('POST /socialmedias', () => {
    //success
    test('should return HTTP status code 201', async () => {
        const { body } = await request(app)
        .post('/socialmedias')
        .set('x-access-token', `${userToken}`)
        .send({name : socialMedia.name, social_media_url : socialMedia.social_media_url})
        .expect(201)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.social_media).toEqual(expect.any(Object))
        expect(body.social_media).toEqual({id : socialMedia.UserId, name : socialMedia.name, social_media_url : socialMedia.social_media_url, 
            UserId :socialMedia.UserId})
    })
    //fail 1
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .post('/socialmedias')
        .set('x-access-token', `${userToken}`)
        .send({name : socialMedia.name, social_media_url : socialMedia.name})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
        expect(body).toMatch(/url/i)
    })
    //fail 2
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .post('/socialmedias')
        .set('x-access-token', `${userToken}`)
        .send({name : null, social_media_url : socialMedia.social_media_url})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
        expect(body).toMatch(/name/i)
    })
})

//PUT socialMedia
describe('PUT /socialmedias', () => {
    // success
    test('should return HTTP status code 201', async () => {
        const { body } = await request(app)
        .put('/socialmedias/1')
        .set('x-access-token', `${userToken}`)
        .send({name : '12345678', social_media_url : 'http://image.com/defaultphoto2.png'})
        .expect(201)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.social_media).toEqual(expect.any(Object))
        expect(body.social_media).toEqual({id : 1, name : '12345678', social_media_url : 'http://image.com/defaultphoto2.png', UserId :1})
    })
    //fail 1
    test('should return HTTP status code 303', async () => {
        const { body } = await request(app)
        .put('/socialmedias/1')
        .set('x-access-token', `${userToken2}`)
        .send({name : '12345678', social_media_url : 'http://image.com/defaultphoto2.png'})
        .expect(303)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not found/i)
    })
    //fail 2
    test('should return HTTP status code 303', async () => {
        const { body } = await request(app)
        .put('/socialmedias/2')
        .set('x-access-token', `${userToken}`)
        .send({name : '12345678', social_media_url : 'http://image.com/defaultphoto2.png'})
        .expect(303)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not found/i)
    })
    //fail 3
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .put('/socialmedias/1')
        .set('x-access-token', `${userToken}`)
        .send({name : '12345678', social_media_url : null})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
        expect(body).toMatch(/url/i)
    })
})

//GET All socialMedia
describe('GET /socialmedias', () => {
    //sucess
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
        .get('/socialmedias')
        .set('x-access-token', `${userToken}`)
        .expect(200)
        expect(body).toEqual(expect.any(Object))
        expect(body).toEqual({SocialMedias : expect.any(Array)})
        expect(body).toEqual({SocialMedias : [expect.any(Object)]})
        expect(body).toEqual({SocialMedias : [{id : expect.any(Number), name : expect.any(String),
            social_media_url : expect.any(String), UserId : expect.any(Number), User : expect.any(Object)}]})
    })
    // fail
    test('should return HTTP status code 401', async () => {
        const { body } = await request(app)
        .get('/socialmedias')
        .expect(401)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not authenticated/i)
    })
})

//DELETE socialMedia
describe('DELETE /socialmedias', () => {
    //fail 1
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
        .delete('/socialmedias/10')
        .set('x-access-token', `${userToken}`)
        .expect(303)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not found/i)
    })
    // fail 2
    test('should return HTTP status code 401', async () => {
        const { body } = await request(app)
        .delete('/socialmedias')
        .expect(401)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not authenticated/i)
    })

    // fail 3
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .delete(`/socialmedias/${null}`)
        .set('x-access-token', `${userToken}`)
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
        expect(body).toMatch(/null/i)
    })
    //success
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
        .delete(`/socialmedias/1`)
        .set('x-access-token', `${userToken}`)
        .expect(200)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body).toEqual({message : 'Your sosial media has been successfully deleted'})
    })
})