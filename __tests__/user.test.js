const request = require('supertest')
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const app = require('../index')

const user = {
    full_name : 'aswar', 
    email : 'aswar@gmail.com', 
    username : 'aswar', 
    password : '12345678', 
    profile_image_url : 'http://image.com/defaultphoto.png', 
    age : 20, 
    phone_number : '085123456789'
}


beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  })
})

afterAll(async () => {
  sequelize.close();
})

describe('register', () => {
    test('should suceess', async () => {
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

    test('should fail', async () => {
        const {body} = await request(app)
            .post('/users/register')
            .send(user)
            .expect(400)
            expect(body).not.toBeNull()
            expect(body).toEqual({message : "Email Already Registered!"})
    })
})

describe('login', () => {
    test('should suceess', async () => {
        const {body} = await request(app)
            .post('/users/login')
            .send({email : user.email, password : user.password})
            .expect(200)
            expect(body).not.toBeNull()
    })
})