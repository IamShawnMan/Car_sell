import { Schema, model } from "mongoose";

const parkingSchema = Schema({
  location: {
    type: String,
    required: true,
  },
  slotNumber: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false,
  },
  bookedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    default: null,
    ref: "User",
  },
  car: {
    type: Schema.Types.ObjectId,
    required: true,
    default: null,
    ref: "Car",
  },
});
