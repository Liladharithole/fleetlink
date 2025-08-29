import Joi from "joi";

export const createVehicleSchema = Joi.object({
  name: Joi.string().trim().required(),
  capacityKg: Joi.number().integer().positive().required(),
  tyres: Joi.number().integer().positive().required(),
});
