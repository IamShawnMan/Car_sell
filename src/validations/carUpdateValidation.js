import Joi from "joi";

export const carUpdateValidate = (data) => {
  const update = Joi.object({
    user: Joi.string().min(1).max(100).optional(),
    plateNumber: Joi.string().min(1).max(20).optional(),
    model: Joi.string().min(3).max(50).optional(),
    color: Joi.string().min(2).max(30).optional(),
  });
  return update.validate(data);
};
