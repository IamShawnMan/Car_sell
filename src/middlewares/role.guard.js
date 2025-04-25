import { appError } from "../utils/errorController.js";

export const roleGuard = (...roles) => {
  return (req, _, next) => {
    try {
      if (roles.length === 0) {
        throw new appError("User role not exist", 404);
      }
      if (!roles.includes(req.user.role)) {
        throw new appError("Forbidden user", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
