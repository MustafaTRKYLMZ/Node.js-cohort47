import { Headers } from "node-fetch";
import app from "../app.js";
import supertest from "supertest";

const request = supertest(app);

describe("GET /", () => {
  it("Quick test", () => {
    expect(1).toBe(1);
  });

  it("should return 200", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
  });

  it("wrong end point", async () => {
    const response = await request.get("/wrong-endpoint");
    expect(response.status).toBe(404);
  });
});

describe("POST /weather/:cityName", () => {
  it("should return 200", async () => {
    const response = await request
      .post("/weather/ankara")
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);
  });

  it("wrong end point", async () => {
    const response = await request.post("/wrong-endpoint");
    expect(response.status).toBe(404);
  });
  it("city name is required", async () => {
    const response = await request.post("/weather/noCityName");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("City name is required");
  });
});
