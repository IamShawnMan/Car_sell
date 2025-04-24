import jwt from "jsonwebtoken";
import { appError } from "../utils/errorController.js";

export const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer")) {
      throw new appError("Authorization error", 401);
    }
    const token = auth.split(" ")[1];
    if (!token) {
      throw new appError("Token not found");
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decode) {
      throw new appError("JWT expired", 401);
    }
    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};
