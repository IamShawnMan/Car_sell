import { connect } from "mongoose";
const dbUrl = process.env.DB_URL;

export const connectDB = async () => {
  try {
    await connect(dbUrl);
    console.log("Database connected successfully...");
  } catch (error) {
    console.log("Database connection error");
    console.log(error);
    process.exit(1);
  }
};
