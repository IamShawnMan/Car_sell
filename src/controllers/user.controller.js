import { User } from "../models/index.js";
import { appError } from "../utils/errorController.js";

export class userController {
  async create(req, res, next) {
    try {
      const body = req.body;
      const user = await User.findOne({ email: body.email });
      if (user) {
        throw new appError(`User with ${body.email} is exist`);
      }
      const newUser = new User(body);
      await newUser.save();

      res.status(201).json({
        status: "success",
        message: "User created successfully",
        error: null,
        data: {
          newUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
