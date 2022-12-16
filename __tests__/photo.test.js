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
  });
  //=======================================================================
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
    expect(res.body).not.toBeNull();
    expect(res.body).toBeDefined();
    expect(res.body).toBeTruthy();
    expect(res.body).toEqual(expect.any(Object));
  });
  //=======================================================================
  it("Read photo", async () => {
    const res = await request(app).get("/photos/").set("x-access-token", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();
    expect(res.body).toBeDefined();
    expect(res.body).toBeTruthy();
    expect(res.body).toEqual(expect.any(Object));
  });
  //=======================================================================
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
    expect(res.body).not.toBeNull();
    expect(res.body).toBeDefined();
    expect(res.body).toBeTruthy();
    expect(res.body).toEqual(expect.any(Object));
  });
  //=========================================================================
  it("Delete photo", async () => {
    const res = await request(app)
      .delete("/photos/1")
      .set("x-access-token", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();
    expect(res.body).toBeDefined();
    expect(res.body).toBeTruthy();
    expect(res.body).toEqual(expect.any(Object));
  });
});
//============================================================================

/* Creating a photo for the user. */
request(app).post("/photos/").set("x-access-token", token).send({
  title: "ini judul",
  caption: "ini caption",
  poster_image_url: "https://iniurl.com",
  UserId: userId,
});
//============================================================================
describe("Test Photo Error", () => {
  // Create //======================================
  test("Harusnya Error 500", async () => {
    const {body} = await request(app)
      .post("/photos/")
      .set("x-access-token", `${token}`)
      .send({
        title: "ini judul",
        caption: "ini caption",
        poster_image_url: "awokwokwokwokwok ",
        UserId: "userId",
      })
      .expect(500);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/Please try again/i);
    expect(body).toMatch(
      /Validation error: Wrong URL format. Please try again/i
    );
  });
  test("Harusnya error 404", async () => {
    const {body} = await request(app)
      .post("/photo/")
      .set("x-access-token", `${token}`)
      .send({
        title: "ini judul",
        caption: "ini caption",
        poster_image_url: "http://image.com/defaultphoto.png ",
        UserId: "userId",
      })
      .expect(404);
    expect(body).not.toBeNull();
  });

  // Read  //==========================================
  test("Harusnya error 401", async () => {
    const {body} = await request(app).get("/photos/").expect(401);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/not authenticated/i);
  });

  // Update //========================================
  test("Harusnya error 500", async () => {
    const {body} = await request(app)
      .delete("/photos/1")
      .set("x-access-token", `bukanBoken`)
      .expect(500);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/jwt malformed. Please try again/i);
  });

  test("Harusnya error 401", async () => {
    const {body} = await request(app).delete("/photos/").expect(401);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/not authenticated/i);
  });

  test("Harusnya error 400", async () => {
    const {body} = await request(app)
      .delete(`/photos/${null}`)
      .set("x-access-token", `${token}`)
      .expect(400);

    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/anda tidak memiliki akses/i);
  });

  // Delete //===========================================
  test("Harusnya error 400", async () => {
    const {body} = await request(app)
      .delete("/photos/10")
      .set("x-access-token", `${token}`)
      .expect(400);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/anda tidak memiliki akses/i);
  });

  test("Harusnya error 401", async () => {
    const {body} = await request(app).delete("/photos/").expect(401);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/not authenticated/i);
  });

  test("Harusnya error 500", async () => {
    const {body} = await request(app)
      .delete(`/photos/${null}`)
      .set("x-access-token", `${token}`)
      .expect(400);
    expect(body).not.toBeNull();
    expect(body).toEqual(expect.any(String));
    expect(body).toMatch(/anda tidak memiliki akses/i);
  });
});