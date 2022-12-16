const request = require('supertest')
const { sequelize } = require('../models/index');
const Model = require('../models/index');
const {hash, compare} = require('../helpers/Hash');
const { queryInterface } = sequelize;
const app = require('../index')
const { sign, verify } = require('../helpers/Jwt');
// users
const user = {
    full_name : 'aswar', 
    email : 'aswar@gmail.com', 
    username : 'aswar', 
    password : hash('12345678'), 
    profile_image_url : 'http://image.com/defaultphoto.png', 
    age : 20, 
    phone_number : '085123456789',
    createdAt: new Date(),
    updatedAt: new Date()
}
const user2 = {
    full_name : 'aswar', 
    email : '2aswar@gmail.com', 
    username : '2aswar', 
    password : hash('12345678'), 
    profile_image_url : 'http://image.com/defaultphoto.png', 
    age : 20, 
    phone_number : '085123456788',
    createdAt: new Date(),
    updatedAt: new Date()
}
//
// photo
const photo = {
    title : 'ini poto 1', 
    caption : 'ini adalah poto 1 dan 1', 
    poster_image_url : 'http://image.com/defaultphoto.png', 
    UserId : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
}
const photo2 = {
    title : 'ini poto 1', 
    caption : 'ini adalah poto 1 dan 1', 
    poster_image_url : 'http://image.com/defaultphoto.png', 
    UserId : 2,
    createdAt: new Date(),
    updatedAt: new Date(),
}
//

let comment = {
    PhotoId : 1,
    comment : 'ini comment kami'
}
//token
let userToken = sign({ id: 1, email: user.email })
const userToken2 = sign({ id: 2, email: user2.email })
//
beforeAll(async () => {
     await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await queryInterface.bulkDelete('Comments', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
   await queryInterface.bulkDelete('Photos', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
   await queryInterface.bulkInsert('Users', [user, user2])
   await queryInterface.bulkInsert('Photos', [photo, photo2])
})

afterAll(async () => {
  sequelize.close();
})

describe('login', () => {
    // success
    test('should return HTTP status code 200', async () => {
        const {body} = await request(app)
            .post('/users/login')
            .send({email : user.email, password : '12345678'})
            .expect(200)
            expect(body).not.toBeNull()
            expect(body).toEqual(expect.any(Object))
            expect(body).toEqual({ token: expect.any(String) })
             userToken = body.token
            const claimToken = verify(userToken)
            expect(claimToken).toEqual({id : 1, email :user.email, iat: expect.any(Number), exp : expect.any(Number)})
    })
})

//POST comments
describe('POST /comments', () => {
    //success
    test('should return HTTP status code 201', async () => {
        const { body } = await request(app)
        .post('/comments')
        .set('x-access-token', `${userToken}`)
        .send(comment)
        .expect(201)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.comment).toEqual(expect.any(Object))
        expect(body.comment.comment).toEqual(comment.comment)
    })
    //fail 1
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .post('/comments')
        .set('x-access-token', `${userToken}`)
        .send({PhotoId : 'ewgeherj', comment : 'ini comment kami'})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
        expect(body).toMatch(/invalid/i)
    })
    //fail 2
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .post('/comments')
        .set('x-access-token', `${userToken}`)
        .send({PhotoId : 1, comment : null})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
        expect(body).toMatch(/comment/i)
    })
})

//PUT commets
describe('PUT /comments', () => {
    // success
    test('should return HTTP status code 201', async () => {
        const { body } = await request(app)
        .put('/comments/1')
        .set('x-access-token', `${userToken}`)
        .send({comment : 'stelah di update'})
        .expect(200)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.comment).toEqual(expect.any(Object))
        expect(body.comment.comment).toEqual('stelah di update')
    })
    //fail 1
    test('should return HTTP status code 400', async () => {
        const { body } = await request(app)
        .put('/comments/1')
        .set('x-access-token', `${userToken2}`)
        .send({comment : "stelah di update"})
        .expect(400)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/anda tidak memiliki akses/i)
    })
    //fail 2
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .put('/comments/2')
        .set('x-access-token', `${userToken}`)
        .send({comment : "stelah di update"})
        .expect(400)
       expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/anda tidak memiliki akses/i)
    })
    //fail 3
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .put('/comments/1')
        .set('x-access-token', `${userToken}`)
        .send({comment : null})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/null/i)
    })
})

//GET All comments
describe('GET /comments', () => {
    //sucess
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
        .get('/comments')
        .set('x-access-token', `${userToken}`)
        .expect(200)
        expect(body).toEqual(expect.any(Object))
        expect(body.comments).toEqual(expect.any(Array))
        expect(body.comments[0].Photo).toEqual(expect.any(Object))
        expect(body.comments[0].User).toEqual(expect.any(Object))
    })
    // fail
    test('should return HTTP status code 401', async () => {
        const { body } = await request(app)
        .get('/comments')
        .expect(401)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not authenticated/i)
    })
})

//DELETE comments
describe('DELETE /comments', () => {
    //fail 1
    test('should return HTTP status code 303', async () => {
        const { body } = await request(app)
        .delete('/comments/10')
        .set('x-access-token', `${userToken}`)
        .expect(400)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/anda tidak memiliki akses/i)
    })
    // fail 2
    test('should return HTTP status code 401', async () => {
        const { body } = await request(app)
        .delete('/comments')
        .expect(401)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/not authenticated/i)
    })

    // fail 3
    test('should return HTTP status code 500', async () => {
        const { body } = await request(app)
        .delete(`/comments/${null}`)
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
        .delete(`/comments/1`)
        .set('x-access-token', `${userToken}`)
        .expect(200)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body).toEqual({message : "Your comment has been successfully deleted"})
    })
})