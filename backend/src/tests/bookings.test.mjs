import request from "supertest";
import app from "../app.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";

describe("Bookings API", () => {
  let testVehicle;

  beforeEach(async () => {
    // Clean up and create a test vehicle before each test
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    testVehicle = await Vehicle.create({
      name: "Test Truck",
      capacityKg: 1500,
      tyres: 4,
    });
  });

  test("should create booking (201)", async () => {
    const res = await request(app).post("/api/bookings").send({
      vehicleId: testVehicle._id.toString(),
      fromPincode: "400001",
      toPincode: "400020",
      startTime: new Date().toISOString(),
      customerId: "user123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.vehicleId).toBe(testVehicle._id.toString());
    expect(res.body).toHaveProperty("endTime"); // Should be auto-calculated
  });

  test("should return 404 for invalid vehicle", async () => {
    const res = await request(app).post("/api/bookings").send({
      vehicleId: "64f5b7e2e3e4e6a1a2a2a2a2", // Non-existent ID
      fromPincode: "400001",
      toPincode: "400020",
      startTime: new Date().toISOString(),
      customerId: "user123",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 for missing required fields", async () => {
    const res = await request(app).post("/api/bookings").send({
      // Missing vehicleId
      fromPincode: "400001",
      toPincode: "400020",
      startTime: new Date().toISOString(),
      customerId: "user123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 for invalid date format", async () => {
    const res = await request(app).post("/api/bookings").send({
      vehicleId: testVehicle._id.toString(),
      fromPincode: "400001",
      toPincode: "400020",
      startTime: "invalid-date",
      customerId: "user123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should prevent double booking", async () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    // Create first booking
    await request(app).post("/api/bookings").send({
      vehicleId: testVehicle._id.toString(),
      fromPincode: "400001",
      toPincode: "400020",
      startTime: startTime.toISOString(),
      customerId: "user123",
    });

    // Try to create overlapping booking
    const res = await request(app)
      .post("/api/bookings")
      .send({
        vehicleId: testVehicle._id.toString(),
        fromPincode: "400001",
        toPincode: "400020",
        startTime: new Date(startTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes after first booking
        customerId: "user456",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should allow booking when previous booking ends", async () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    // Create first booking
    await request(app).post("/api/bookings").send({
      vehicleId: testVehicle._id.toString(),
      fromPincode: "400001",
      toPincode: "400020",
      startTime: startTime.toISOString(),
      customerId: "user123",
    });

    // Try to create booking after first one ends
    const res = await request(app)
      .post("/api/bookings")
      .send({
        vehicleId: testVehicle._id.toString(),
        fromPincode: "400001",
        toPincode: "400020",
        startTime: new Date(endTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes after first booking ends
        customerId: "user456",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  test("should accept custom endTime if provided", async () => {
    const startTime = new Date();
    const customEndTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours later

    const res = await request(app).post("/api/bookings").send({
      vehicleId: testVehicle._id.toString(),
      fromPincode: "400001",
      toPincode: "400020",
      startTime: startTime.toISOString(),
      endTime: customEndTime.toISOString(),
      customerId: "user123",
    });

    expect(res.status).toBe(201);

    // Check if the dates are within 1 second of each other
    const receivedEndTime = new Date(res.body.endTime).getTime();
    expect(receivedEndTime).toBeGreaterThanOrEqual(
      customEndTime.getTime() - 1000
    );
    expect(receivedEndTime).toBeLessThanOrEqual(customEndTime.getTime() + 1000);
  });
});
