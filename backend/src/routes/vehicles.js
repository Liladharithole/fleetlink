import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { createVehicleSchema } from "../validators/vehicles.js";

const router = Router();

// POST /api/vehicles
router.post("/", async (req, res) => {
  // Validate request body against schema
  const { error } = createVehicleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Manual validation for required fields
  if (
    !req.body.name ||
    req.body.capacityKg === undefined ||
    req.body.tyres === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate capacity is positive
  if (req.body.capacityKg <= 0) {
    return res.status(400).json({ error: "capacityKg must be greater than 0" });
  }

  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    return res.status(201).json(vehicle);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating vehicle:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/vehicles/available
router.get("/available", async (req, res) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

  // Validate required query parameters
  if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
    return res.status(400).json({
      error:
        "Missing required query parameters: capacityRequired, fromPincode, toPincode, startTime",
      estimatedRideDurationHours: 0,
      vehicles: [],
    });
  }

  try {
    // Simple estimation: 2 hours for any trip
    const estimatedRideDurationHours = 2;

    // Get vehicles with sufficient capacity
    const vehicles = await Vehicle.find({
      capacityKg: { $gte: parseInt(capacityRequired) },
    });

    // Filter out vehicles with overlapping bookings
    const availableVehicles = [];
    const start = new Date(startTime);
    const end = new Date(
      start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
    );

    for (const vehicle of vehicles) {
      const overlappingBooking = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
      });

      if (!overlappingBooking) {
        availableVehicles.push(vehicle);
      }
    }

    return res.json({
      estimatedRideDurationHours,
      vehicles: availableVehicles,
    });
  } catch (error) {
    console.error("Error in /available:", error);
    return res.status(500).json({
      error: "Internal server error",
      estimatedRideDurationHours: 0,
      vehicles: [],
    });
  }
});

export default router;
