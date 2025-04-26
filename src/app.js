import express from "express";
import { customError } from "./utils/errorController.js";
import { carRouter, parkingRouter, userRouter } from "./routes/index.js";
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/car", carRouter);
app.use("/parking", parkingRouter);

app.use(customError);

export default app;
