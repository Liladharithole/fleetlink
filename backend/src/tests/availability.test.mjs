import request from "supertest";
import app from "../app.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { findAvailableVehicles } from "../services/availability.js";

describe("Availability Service", () => {
  describe("findAvailableVehicles", () => {
    let truck1, truck2, truck3;
    const now = new Date();
    const oneHour = 60 * 60 * 1000;

    beforeEach(async () => {
      // Setup test vehicles
      [truck1, truck2, truck3] = await Vehicle.insertMany([
        { name: "Truck 1", capacityKg: 1000, tyres: 4 },
        { name: "Truck 2", capacityKg: 2000, tyres: 6 },
        { name: "Truck 3", capacityKg: 3000, tyres: 8 },
      ]);
    });

    test("should return all vehicles when no bookings exist", async () => {
      const available = await findAvailableVehicles({
        capacityRequired: 500,
        startTime: now,
        endTime: new Date(now.getTime() + oneHour),
      });
      expect(available).toHaveLength(3);
    });

    test("should filter by capacity", async () => {
      const available = await findAvailableVehicles({
        capacityRequired: 2500,
        startTime: now,
        endTime: new Date(now.getTime() + oneHour),
      });
      expect(available).toHaveLength(1);
      expect(available[0]._id.toString()).toBe(truck3._id.toString());
    });

    test("should exclude vehicles with overlapping bookings", async () => {
      // Create a booking for truck1
      await Booking.create({
        vehicleId: truck1._id,
        fromPincode: "400001",
        toPincode: "400020",
        startTime: now,
        endTime: new Date(now.getTime() + oneHour),
        customerId: "user1",
      });

      const available = await findAvailableVehicles({
        capacityRequired: 500,
        startTime: now,
        endTime: new Date(now.getTime() + oneHour),
      });

      const availableIds = available.map((v) => v._id.toString());
      expect(available).toHaveLength(2);
      expect(availableIds).not.toContain(truck1._id.toString());
    });

    test("should handle edge case where booking ends exactly at start time", async () => {
      await Booking.create({
        vehicleId: truck1._id,
        fromPincode: "400001",
        toPincode: "400020",
        startTime: new Date(now.getTime() - oneHour),
        endTime: now, // ends exactly at start time
        customerId: "user1",
      });

      const available = await findAvailableVehicles({
        capacityRequired: 500,
        startTime: now,
        endTime: new Date(now.getTime() + oneHour),
      });

      // Should be available since booking ends at start time
      const availableIds = available.map((v) => v._id.toString());
      expect(availableIds).toContain(truck1._id.toString());
    });

    test("should handle multiple bookings for same vehicle", async () => {
      // Create two bookings for truck1 that don't overlap with our target time
      await Booking.insertMany([
        {
          vehicleId: truck1._id,
          fromPincode: "400001",
          toPincode: "400020",
          startTime: new Date(now.getTime() - 3 * oneHour),
          endTime: new Date(now.getTime() - 2 * oneHour),
          customerId: "user1",
        },
        {
          vehicleId: truck1._id,
          fromPincode: "400001",
          toPincode: "400020",
          startTime: new Date(now.getTime() + 2 * oneHour),
          endTime: new Date(now.getTime() + 3 * oneHour),
          customerId: "user2",
        },
      ]);

      const available = await findAvailableVehicles({
        capacityRequired: 500,
        startTime: now,
        endTime: new Date(now.getTime() + oneHour),
      });

      // Should be available since no bookings overlap with target time
      const availableIds = available.map((v) => v._id.toString());
      expect(availableIds).toContain(truck1._id.toString());
    });
  });

  describe("API Endpoints", () => {
    test("should return vehicles with estimated hours", async () => {
      await Vehicle.create({ name: "Mini Truck", capacityKg: 1000, tyres: 4 });

      const res = await request(app).get("/api/vehicles/available").query({
        capacityRequired: 500,
        fromPincode: "400001",
        toPincode: "400020",
        startTime: new Date().toISOString(),
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("estimatedRideDurationHours");
      expect(Array.isArray(res.body.vehicles)).toBe(true);
    });

    test("should not return vehicles if overlap exists", async () => {
      const v = await Vehicle.create({
        name: "Big Truck",
        capacityKg: 3000,
        tyres: 6,
      });

      const start = new Date();
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

      await Booking.create({
        vehicleId: v._id,
        fromPincode: "400001",
        toPincode: "400020",
        startTime: start,
        endTime: end,
        customerId: "user1",
      });

      const res = await request(app).get("/api/vehicles/available").query({
        capacityRequired: 1000,
        fromPincode: "400001",
        toPincode: "400020",
        startTime: start.toISOString(),
      });

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBe(0);
    });
  });
});
