import { Router } from "express";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { createBookingSchema } from "../validators/bookings.js";

const router = Router();

// GET /api/bookings/stats
router.get("/stats", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysBookings = await Booking.countDocuments({
      createdAt: { $gte: today },
    });

    const upcomingBookings = await Booking.countDocuments({
      startTime: { $gt: new Date() },
    });

    // Get top 5 most booked vehicles
    const popularVehicles = await Booking.aggregate([
      {
        $group: {
          _id: "$vehicleId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      { $unwind: "$vehicle" },
      {
        $project: {
          vehicleId: "$_id",
          vehicleName: "$vehicle.name",
          bookingCount: "$count",
        },
      },
    ]);

    res.json({
      totalBookings,
      todaysBookings,
      upcomingBookings,
      popularVehicles,
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookings
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find()
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("vehicleId", "name capacityKg");

    const total = await Booking.countDocuments();

    res.json({
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
      : (() => {
          const endOfDay = new Date(startTime);
          endOfDay.setHours(23, 59, 59, 999);
          return endOfDay;
        })();

    // Check for existing bookings that overlap with the requested time slot
    const existingBooking = await Booking.findOne({
      vehicleId: req.body.vehicleId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
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

    // Populate the vehicle details in the response
    const populatedBooking = await Booking.findById(booking._id).populate(
      "vehicleId",
      "name capacityKg"
    );

    return res.status(201).json(populatedBooking);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/bookings/:id/accept
router.patch("/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    ).populate("vehicleId", "name capacityKg");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/bookings/:id/complete
router.patch("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    ).populate("vehicleId", "name capacityKg");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/bookings/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
