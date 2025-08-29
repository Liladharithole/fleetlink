import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";

export async function findAvailableVehicles({
  capacityRequired,
  startTime,
  endTime,
}) {
  const candidates = await Vehicle.find({
    capacityKg: { $gte: capacityRequired },
  });
  if (!candidates.length) return [];

  const vehicleIds = candidates.map((v) => v._id);
  const conflicts = await Booking.find({
    vehicleId: { $in: vehicleIds },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  }).select("vehicleId");

  const busy = new Set(conflicts.map((c) => String(c.vehicleId)));
  return candidates.filter((v) => !busy.has(String(v._id)));
}
