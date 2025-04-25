import { Router } from "express";
import { carController } from "../controllers/index.js";

const router = Router();
const controller = new carController();

router
  .post("/", controller.create)
  .get("/", controller.getAll)
  .get("/:id", controller.getOne)
  .put("/:id", controller.update);

export { router as carRouter };
