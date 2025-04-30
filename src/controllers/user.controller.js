import { compare, hash } from "bcryptjs";
import { User } from "../models/index.js";
import { appError } from "../utils/errorController.js";
import { otpGenerate } from "../utils/otp-generator.js";
import {
  userValidation,
  loginValidation,
  userUpdateValidate,
} from "../validations/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { otpMail } from "../utils/createMail.js";
import { transporter } from "../utils/mailer.js";
import { getCache, setCache } from "../utils/catch.js";

export class userController {
  async create(req, res, next) {
    try {
      const { error, value } = userValidation(req.body);

      if (error) {
        throw new appError(error.message, 400);
      }
      const { email, password } = value;
      const user = await User.findOne({ email });
      if (user) {
        throw new appError(`User with ${email} is exist`, 400);
      }

      const hashedPassword = await hash(password, 10);
      const newUser = new User({
        ...value,
        password: hashedPassword,
      });
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
  async login(req, res, next) {
    try {
      const { error, value } = loginValidation(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      const { email, password } = value;
      const user = await User.findOne({ email });

      if (!user) {
        throw new appError("User not found", 404);
      }
      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new appError("Password is not matched", 403);
      }
      const otp = otpGenerate();

      const data = {
        email: user.email,
        otp,
      };

      transporter.sendMail(otpMail(data), (err, info) => {
        if (err) {
          throw new appError("Error on sending mail", 400);
        } else {
          console.log(info);
          setCache(user.email, otp);
        }
      });

      res.status(200).json({
        status: "success",
        message: "Confirmation code sent to your email",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
  async confirmLogin(req, res, next) {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        throw new appError("User not found", 404);
      }

      const otpCache = getCache(email);

      if (!otpCache || otpCache != otp) {
        throw new appError("OTP expired", 400);
      }

      const payload = {
        id: user._id,
        name: user.fullName,
        role: user.role,
        email: user.email,
      };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        expires: Number(process.env.REFRESH_TOKEN_EXPIRES),
      });

      res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        data: {
          ...payload,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(_, res, next) {
    try {
      const users = await User.find(
        {},
        "_id __v fullName role createdAt updatedAt"
      );
      res.status(200).json({
        status: "success",
        message: "All users",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne(
        { _id: id },
        "_id __v fullName role createdAt updatedAt"
      );
      if (!user) {
        throw new appError("User not found", 404);
      }
      res.status(200).json({
        status: "success",
        message: "User by id",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async getMe(req, res, next) {
    try {
      const { id } = req.user;
      const user = await User.findById(id, "fullName email role");

      if (!user) {
        throw new appError("User not found", 404);
      }

      res.json({
        status: "success",
        message: "My account",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new appError("User not found", 404);
      }
      const { error, value } = userUpdateValidate(req.body);
      if (error) {
        throw new appError(error.message, 400);
      }
      // const data = req.body;
      const { email, password } = value;
      if (email) {
        const existEmail = await User.findOne({ email });
        if (existEmail) {
          throw new appError("User with this email already exist", 400);
        }
      }
      if (password) {
        const hashedPassword = await hash(password, 10);
        value.password = hashedPassword;
      }
      const updatedUser = await User.findByIdAndUpdate(id, value, {
        new: true,
      });
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        throw new appError("User not found", 404);
      }
      await User.findByIdAndDelete(id);
      res.json({
        status: "success",
        message: "User deleted successfully",
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
