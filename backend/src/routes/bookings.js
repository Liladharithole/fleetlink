import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { createBookingSchema } from "../validators/bookings.js";

const router = Router();

// POST /api/bookings
router.post("/", async (req, res) => {
  // Validate request body against schema
  const { error } = createBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(req.body.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const startTime = new Date(req.body.startTime);
    const endTime = req.body.endTime
      ? new Date(req.body.endTime)
      : new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    // Check for existing bookings that overlap with the requested time slot
    const existingBooking = await Booking.findOne({
      vehicleId: req.body.vehicleId,
      $or: [
        // New booking starts during an existing booking
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        // New booking ends during an existing booking
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        // New booking completely contains an existing booking
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "Vehicle is already booked for the requested time slot",
      });
    }

    // Create booking with specified or default endTime
    const booking = await Booking.create({
      ...req.body,
      startTime,
      endTime,
    });

    return res.status(201).json(booking);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
