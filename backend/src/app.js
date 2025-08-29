import express from "express";
import cors from "cors";
import vehiclesRouter from "./routes/vehicles.js";
import bookingsRouter from "./routes/bookings.js";

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/bookings", bookingsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
