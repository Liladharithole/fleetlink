import request from "supertest";
import app from "../app.js";

describe("Vehicles API", () => {
  test("should create a vehicle (201)", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({ name: "Tata 407", capacityKg: 2000, tyres: 6 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Tata 407");
  });

  test("should fail on invalid input (400)", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({ capacityKg: -10 });

    expect(res.status).toBe(400);
  });
});
