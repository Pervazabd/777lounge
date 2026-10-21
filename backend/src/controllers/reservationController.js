import mongoose from "mongoose";
import { Reservation } from "../models/Reservation.js";
import { validateReservation } from "../utils/validateReservation.js";

export async function getAdminReservations(_request, response) {
  const reservations = await Reservation.find()
    .sort({ date: -1, time: -1, createdAt: -1 })
    .lean();

  return response.json({
    success: true,
    data: { reservations },
  });
}

export async function cancelReservation(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({
      success: false,
      message: "Rezervasyon kimliği geçersiz.",
    });
  }

  const reservation = await Reservation.findById(request.params.id);
  if (!reservation) {
    return response.status(404).json({
      success: false,
      message: "Rezervasyon bulunamadı.",
    });
  }

  if (reservation.status === "cancelled") {
    return response.status(409).json({
      success: false,
      message: "Bu rezervasyon zaten iptal edilmiş.",
    });
  }

  reservation.status = "cancelled";
  await reservation.save();

  return response.json({
    success: true,
    data: { reservation },
  });
}

export async function deleteReservation(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({
      success: false,
      message: "Rezervasyon kimliği geçersiz.",
    });
  }

  const reservation = await Reservation.findByIdAndDelete(request.params.id);
  if (!reservation) {
    return response.status(404).json({
      success: false,
      message: "Rezervasyon bulunamadı.",
    });
  }

  return response.json({
    success: true,
    data: { id: reservation.id },
  });
}

export async function deleteAllReservations(_request, response) {
  const result = await Reservation.deleteMany({});

  return response.json({
    success: true,
    data: { deletedCount: result.deletedCount },
  });
}

export async function createReservation(request, response) {
  const { value, errors } = validateReservation(request.body);

  if (errors) {
    return response.status(400).json({
      success: false,
      message: "Reservation details are invalid.",
      errors,
    });
  }

  const reservation = await Reservation.create(value);

  return response.status(201).json({
    success: true,
    message: "Reservation request received.",
    data: {
      id: reservation.id,
      status: reservation.status,
      date: reservation.date,
      time: reservation.time,
    },
  });
}
