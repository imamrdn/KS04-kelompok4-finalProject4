const request = require("supertest");
const {sequelize} = require("./../models/index");
const {queryInterface} = sequelize;
const jwt = require("jsonwebtoken");
const app = require("../index");

const user = {
  full_name: "aswar",
  email: "aswar@gmail.com",
  username: "aswar",
  password: "12345678",
  profile_image_url: "http://image.com/defaultphoto.png",
  poster_image_url: "http://image.com/defaultphoto.png",
  age: 20,
  phone_number: "085123456789",
};

beforeAll(async () => {
  await queryInterface.bulkDelete("Photos", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("SocialMedia", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

afterAll(async () => {
  sequelize.close();
});

let token = "";
let userId = "";
describe("SocialMedia sukses ", () => {
  it("Create User dan buat token", async () => {
    const res = await request(app).post("/users/register").send(user);
    token = await request(app)
      .post("/users/login")
      .send({email: user.email, password: user.password})
      .then((result) => {
        return result._body.token;
      });
    userId = jwt.decode(token);
    userId = userId.id;
    console.log(token);
  });
  it("Create SocialMedia", async () => {
    const res = await request(app)
      .post("/socialmedias/")
      .set("x-access-token", token)
      .send({
        name: "pacebook",
        social_media_url: "www.pacebook.com",
      });
    expect(res.statusCode).toEqual(201);
  });
  it("Read SocialMedia", async () => {
    const res = await request(app)
      .get("/socialmedias/")
      .set("x-access-token", token);
    expect(res.statusCode).toEqual(200);
  });
  it("Update SocialMedia", async () => {
    const res = await request(app)
      .put(`/socialmedias/${userId}`)
      .set("x-access-token", token)
      .send({
        name: "intelgram",
        social_media_url: "http://intelgram.com",
      });
    expect(res.statusCode).toEqual(201);
  });
  it("Delete SocialMedia", async () => {
    const res = await request(app)
      .delete(`/socialmedias/${userId}`)
      .set("x-access-token", token);
    expect(res.statusCode).toEqual(200);
  });
});
