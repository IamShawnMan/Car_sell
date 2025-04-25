import Joi from "joi";

export const userValidation = (data) => {
  const admin = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(5).max(30).email().required(),
    password: Joi.string().min(5).max(20).required(),
    role: Joi.string().valid("admin", "user"),
  });
  return admin.validate(data);
};
