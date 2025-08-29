import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import vehiclesRouter from "./routes/vehicles.js";
import bookingsRouter from "./routes/bookings.js";
import connectDB from "./db.js";
import "dotenv/config";

const app = express();

// Connect to MongoDB
connectDB(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/bookings", bookingsRouter);

// Health check endpoint with detailed information
app.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const dbName = mongoose.connection.name || "Not connected";
  const dbHost = mongoose.connection.host || "Not connected";
  const dbPort = mongoose.connection.port || "Not connected";

  res.status(200).json({
    status: "ok",
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      port: process.env.PORT || 3001,
    },
    database: {
      status: dbStatus,
      name: dbName,
      host: dbHost,
      port: dbPort,
      models: Object.keys(mongoose.connection.models),
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
