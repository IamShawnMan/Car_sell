import Joi from "joi";

export const loginValidation = (data) => {
  const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return login.validate(data);
};
