import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    fullName: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    email: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    password: {
      type: String,
      min: 5,
      max: 20,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
