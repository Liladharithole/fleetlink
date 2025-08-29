import Joi from "joi";

export const createBookingSchema = Joi.object({
  vehicleId: Joi.string().hex().length(24).required(),
  fromPincode: Joi.string().required(),
  toPincode: Joi.string().required(),
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().optional(),
  customerName: Joi.string().min(2).max(100).optional(),
  customerPhone: Joi.string().min(7).max(20).optional(),
  customerId: Joi.string().required(),
});
