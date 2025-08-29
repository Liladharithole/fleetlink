import Joi from "joi";

export const createBookingSchema = Joi.object({
  vehicleId: Joi.string().hex().length(24).required(),
  fromPincode: Joi.string().required(),
  toPincode: Joi.string().required(),
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().optional(),
  customerId: Joi.string().required(),
});
