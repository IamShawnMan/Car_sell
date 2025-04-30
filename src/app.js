import express from "express";
import path from "path";
import { customError } from "./utils/errorController.js";
import { carRouter, parkingRouter, userRouter } from "./routes/index.js";
import { writeLog } from "./utils/morgan.js";
const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(writeLog(__dirname));

app.use("/user", userRouter);
app.use("/car", carRouter);
app.use("/parking", parkingRouter);

app.use(customError);

export default app;
