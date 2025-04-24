import { Router } from "express";
import { userController } from "../controllers/index.js";

const router = Router();
const controller = new userController();

router.post("/", controller.create);

export { router as userRouter };
