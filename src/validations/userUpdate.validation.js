import Joi from "joi";

export const userUpdateValidate = (data) => {
  const update = Joi.object({
    fullName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().min(5).max(30).email().optional(),
    password: Joi.string().min(5).max(20).optional(),
    role: Joi.string().valid("admin", "user").optional(),
  });
  return update.validate(data);
};
