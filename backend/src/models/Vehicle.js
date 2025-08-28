import mongoose from "mongoose";

// Creating Data model for vehicle

const VehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacityKg: { type: Number, required: true },
    tyres: { type: Number, required: true },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
export default Vehicle;
