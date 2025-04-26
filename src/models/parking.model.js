import { Schema, model } from "mongoose";

const parkingSchema = new Schema({
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
    default: false,
  },
  bookedBy: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "User",
  },
  car: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Car",
  },
});

export const Parking = model("Parking", parkingSchema);
