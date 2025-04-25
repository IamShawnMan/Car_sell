import Joi from "joi";

export const carCreateValidation = (data) => {
  const car = Joi.object({
    user: Joi.string().required().min(1).max(100),
    plateNumber: Joi.string().min(1).max(20).required(),
    model: Joi.string().min(3).max(50).required(),
    color: Joi.string().min(2).max(30).required(),
  });
  return car.validate(data);
};
