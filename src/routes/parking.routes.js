import { Router } from "express";
import { parkingController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.guard.js";
import { roleGuard } from "../middlewares/role.guard.js";

const controller = new parkingController();

const router = Router();

router
  .post("/", authMiddleware, roleGuard("admin"), controller.create)
  .get("/", authMiddleware, controller.getAll)
  .get("/:id", authMiddleware, controller.getOne)
  .put("/book/:id", authMiddleware, controller.book)
  .put("/unbook/:id", authMiddleware, controller.unbook);

export { router as parkingRouter };
