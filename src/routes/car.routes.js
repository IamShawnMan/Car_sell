import { Router } from "express";
import { carController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/auth.guard.js";

const router = Router();
const controller = new carController();

router
  .post("/", authMiddleware, controller.create)
  .get("/", authMiddleware, controller.getAll)
  .get("/:id", authMiddleware, controller.getOne)
  .put("/:id", authMiddleware, controller.update)
  .delete("/:id", authMiddleware, controller.delete);

export { router as carRouter };
