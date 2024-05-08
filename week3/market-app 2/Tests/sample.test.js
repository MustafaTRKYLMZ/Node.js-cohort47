import request from "supertest";
import app from "../app";

describe("POST /users/login", function () {
  it("responds with error", function (done) {
    request(app)
      .post("/users/login")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, done)
      .expect({ error: "Invalid email or password" });
  });
});
describe("POST /users/register", function () {
  it("responds with error", function (done) {
    request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, done)
      .expect({ error: "Email and password are required" });
  });
  it("HTTPS success status code", function (done) {
    request(app)
      .post("/users/register")
      .set("Accept", "application/json")
      .field("email", "email@email.com")
      // I have a probloem with this line That is whp I am skipping this test
      .field("password", "123456789")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
