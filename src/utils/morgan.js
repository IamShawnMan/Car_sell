import morgan from "morgan";
import path from "path";
import { config } from "dotenv";
import fs from "fs";
config();

export function writeLog(dirname) {
  const filePath = fs.createWriteStream(path.join(dirname, "access.log"), {
    flag: "a",
  });
  if (process.env.NODE_ENV === "PRODUCTION") {
    return morgan("combined", {
      stream: filePath,
    });
  } else {
    return morgan("dev");
  }
}
