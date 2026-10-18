import { Reservation } from "../models/Reservation.js";
import { validateReservation } from "../utils/validateReservation.js";

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
