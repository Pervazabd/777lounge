import mongoose from "mongoose";
const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    time: {
      type: String,
      required: true,
      match: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    },
    guests: {
      type: String,
      required: true,
      match: /^(?:[1-9]\d{0,2}|20[+])$/,
    },
    area: {
      type: String,
      required: true,
      enum: ["garden", "indoor", "game-room"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Reservation = mongoose.model("Reservation", reservationSchema);
