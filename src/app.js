import express from "express";
import { customError } from "./utils/errorController.js";
import { userRouter } from "./routes/index.js";
const app = express();

app.use(express.json());

app.use("/user", userRouter);

app.use(customError);

export default app;
