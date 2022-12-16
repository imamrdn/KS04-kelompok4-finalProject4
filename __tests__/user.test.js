const request = require('supertest')
const { sequelize } = require('../models/index');
const { queryInterface } = sequelize;
const app = require('../index')
const { sign, verify } = require('../helpers/Jwt');
const user = {
    full_name : 'aswar', 
    email : 'aswar@gmail.com', 
    username : 'aswar', 
    password : '12345678', 
    profile_image_url : 'http://image.com/defaultphoto.png', 
    age : 20, 
    phone_number : '085123456789'
}

const userUpdate = {
    full_name : 'aswar123', 
    email : user.email, 
    username : 'aswar1', 
    password : '12345678', 
    profile_image_url : 'http://image.com/defaultphotos.png', 
    age : 22, 
    phone_number : '085123456781'
}
let Token = '' 

beforeAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

afterAll(async () => {
  sequelize.close();
})
// POST users register
describe('register', () => {
    // success
    test('should return HTTP status code 201', async () => {
        const {body} = await request(app)
            .post('/users/register')
            .send(user)
            .expect(201)
            expect(body).not.toBeNull()
            expect(body.User).toEqual({full_name : user.full_name, email : user.email, username : user.username, 
                profile_image_url : user.profile_image_url, age : user.age, phone_number : user.phone_number})
            expect(body.User.email).toEqual(expect.objectContaining(/^@/))
            expect(body.User.profile_image_url).toEqual(expect.objectContaining(/^http|https/))
    })
    // fail 1
    test('should return HTTP status code 400', async () => {
        const {body} = await request(app)
            .post('/users/register')
            .send(user)
            .expect(400)
            expect(body).not.toBeNull()
            expect(body).toEqual(expect.any(Object))
            expect(body).toEqual({message : "Email Already Registered!"})
    })
    // fail 2
    test('should return HTTP status code 400', async () => {
        const {body} = await request(app)
            .post('/users/register')
            .send({full_name : user.full_name, email : "weeerr@gmail.com", username : user.username, password : user.password, 
                profile_image_url : user.profile_image_url, age : user.age, phone_number : user.phone_number})
            .expect(400)
            expect(body).not.toBeNull()
            expect(body).toEqual(expect.any(Object))
            expect(body).toEqual({message : "Username Already Registered!"})
    })
    // fail 3
     test('should return HTTP status code 400', async () => {
        const {body} = await request(app)
            .post('/users/register')
            .send({full_name : user.full_name, email : "weeerr@gmail.com", username : "qwertytrewwe", password : user.password,
                profile_image_url : user.profile_image_url, age : user.age, phone_number : user.phone_number})
            .expect(400)
            expect(body).not.toBeNull()
            expect(body).toEqual({message : "Phone Number Already Registered"})
    })
})
// POST users login
describe('login', () => {
    // success
    test('should return HTTP status code 200', async () => {
        const {body} = await request(app)
            .post('/users/login')
            .send({email : user.email, password : user.password})
            .expect(200)
            expect(body).not.toBeNull()
            expect(body).toEqual(expect.any(Object))
            expect(body).toEqual({ token: expect.any(String) })
             Token = body.token
            const claimToken = verify(Token)
            expect(claimToken).toEqual({id : 1, email :user.email, iat: expect.any(Number), exp : expect.any(Number)})
    })
    // fail 1
     test('should return HTTP status code 404', async () => {
        const {body} = await request(app)
            .post('/users/login')
            .send({email : '1234@ggmail.com', password : user.password})
            .expect(404)
            expect(body).not.toBeNull()
            expect(body).toEqual(expect.any(String))
            expect(body).toEqual('Email Not Registered')
    })
    // fail 2
    test('should return HTTP status code 404', async () => {
        const {body} = await request(app)
            .post('/users/login')
            .send({email : user.email, password : 'qwertyui'})
            .expect(404)
            expect(body).not.toBeNull()
            expect(body).toEqual(expect.any(String))
            expect(body).toEqual('Password Not Found')
    })
})
// PUT users update
describe('update', () => {
    // success
    test('should return HTTP status code 201', async () => {
        const {body} = await request(app)
        .put('/users/1')
        .set('x-access-token', `${Token}`)
        .send(userUpdate)
        .expect(201)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.User).toEqual(expect.any(Object))
        expect(body.User).toEqual({full_name : userUpdate.full_name, email : userUpdate.email, username : userUpdate.username, 
                profile_image_url : userUpdate.profile_image_url, age : userUpdate.age, phone_number : userUpdate.phone_number})
    })
    // fail 1
    test('should return HTTP status code 400', async () => {
        const {body} = await request(app)
        .put('/users/2')
        .send(userUpdate)
        .set('x-access-token', `${Token}`)
        .expect(400)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.message).toEqual(expect.any(String))
        expect(body.message).toEqual('Tidak punya akses')
    })
    // fail 2
    test('should return HTTP status code 500', async () => {
        const {body} = await request(app)
        .put('/users/1')
        .set('x-access-token', `${Token}`)
        .send({full_name : user.full_name, email : "weeerrgmail.com", username : user.username, password : user.password, 
                profile_image_url : user.profile_image_url, age : user.age, phone_number : user.phone_number})
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.message).toEqual("Please Try again")
        expect(body.errorMessage).toEqual(expect.any(String))
    })
})
// DELETE users
describe('delete', () => {
    // fail 1
    test('should return HTTP status code 400', async () => {
        const {body} = await request(app)
        .delete('/users/2')
        .set('x-access-token', `${Token}`)
        .expect(400)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.message).toEqual(expect.any(String))
        expect(body.message).toEqual('Tidak punya akses')
    })
    // fail 2
    test('should return HTTP status code 500', async () => {
        const {body} = await request(app)
        .delete('/users/')
        .set('x-access-token', `${Token+12334}`)
        .expect(500)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(String))
        expect(body).toMatch(/Please try again/i)
    })
    // success
    test('should return HTTP status code 200', async () => {
        const {body} = await request(app)
        .delete('/users/1')
        .set('x-access-token', `${Token}`)
        .expect(200)
        expect(body).not.toBeNull()
        expect(body).toEqual(expect.any(Object))
        expect(body.message).toEqual(expect.any(String))
        expect(body.message).toEqual("Your account has been successfully deleted")
    })
})