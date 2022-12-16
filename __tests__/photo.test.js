const request = require("supertest");
const {sequelize} = require("../models/index");
const {queryInterface} = sequelize;
const app = require("../index");
const jwt = require("jsonwebtoken");

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
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await queryInterface.bulkDelete("Photos", null, {
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
describe("Test Photo Sukses", () => {
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

  it("Create photo", async () => {
    const res = await request(app)
      .post("/photos/")
      .set("x-access-token", token)
      .send({
        title: "ini judul",
        caption: "ini caption",
        poster_image_url: "https://iniurl.com",
        UserId: userId,
      });
    expect(res.statusCode).toEqual(201);
  });

  it("Read photo", async () => {
    const res = await request(app).get("/photos/").set("x-access-token", token);
    expect(res.statusCode).toEqual(200);
  });

  it("Update photo", async () => {
    const res = await request(app)
      .put("/photos/1")
      .set("x-access-token", token)
      .send({
        title: "ini title baru",
        caption: "ini caption baru",
        poster_image_url: "http://iniurlbaru.com",
      });
    expect(res.statusCode).toEqual(201);
  });

  it("Delete photo", async () => {
    const res = await request(app)
      .delete("/photos/1")
      .set("x-access-token", token);
    expect(res.statusCode).toEqual(200);
  });
});

describe("Test Photo Error", () => {
  it("Create photo Error not found", async () => {
    const res = await request(app)
      .post("/photo/")
      .set("x-access-token", token)
      .send({
        title: "ini judul",
        caption: "ini caption",
        poster_image_url: "https://iniurl.com",
        UserId: userId,
      });
    expect(res.statusCode).toEqual(404);
  });
});
