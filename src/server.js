import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 8080;
console.log(port);

const start = () => {
  try {
    connectDB();
    app.listen(port, () => {
      console.log(`Server started on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
