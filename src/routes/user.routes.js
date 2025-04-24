import { Router } from "express";
import { userController } from "../controllers/index.js";

const router = Router();
const controller = new userController();

router
  .post("/register", controller.create)
  .post("/login", controller.login)
  .get("/", controller.getAll)
  .get("/:id", controller.getById)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);

export { router as userRouter };
