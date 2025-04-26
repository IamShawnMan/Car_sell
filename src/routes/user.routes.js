import { Router } from "express";
import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";

const router = Router();
const controller = new userController();

router
  .post("/register", controller.create)
  .post("/login", controller.login)
  .get("/", authMiddleware, roleGuard("admin"), controller.getAll)
  .get("/:id", authMiddleware, roleGuard("admin"), controller.getById)
  .put("/:id", authMiddleware, controller.update)
  .delete("/:id", authMiddleware, roleGuard("admin"), controller.delete);

export { router as userRouter };
