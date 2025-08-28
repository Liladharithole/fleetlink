import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  fromPincode: { type: String, required: true },
  toPincode: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  customerId: { type: String, required: true },
}, { timestamps: true });

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
