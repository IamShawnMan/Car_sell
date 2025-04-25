import express from "express";
import { customError } from "./utils/errorController.js";
import { carRouter, userRouter } from "./routes/index.js";
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/car", carRouter);

app.use(customError);

export default app;
