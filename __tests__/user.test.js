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
  age: 20,
  phone_number: "085123456789",
};

beforeAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
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
describe("User Sukses", () => {
  it("Register", async () => {
    const res = await request(app).post("/users/register").send(user);
    expect(res.statusCode).toBe(201);
  });

  it("Login", async () => {
    const res = await request(app).post("/users/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toBe(200);
    token = res._body.token;
    userId = jwt.decode(token);
    userId = userId.id;
  });

  it("Update", async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set("x-access-token", token)
      .send({
        username: "Bambang",
      });
    expect(res.statusCode).toBe(201);
  });

  // it("Delete", async () => {
  //   const res = await request(app)
  //     .delete(`/users/${userId}`)
  //     .set("x-access-token", token);
  //   expect(res.statusCode).toBe(200);
  // });
});

describe("User Error", () => {});
