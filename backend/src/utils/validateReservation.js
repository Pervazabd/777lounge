const allowedFields = new Set([
  "name",
  "phone",
  "date",
  "time",
  "guests",
  "area",
  "notes",
]);

export const reservationTimes = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00",
];

const allowedTimes = new Set(reservationTimes);

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function todayInIstanbul() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export function validateReservation(body) {
  const errors = {};

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { errors: { body: "A JSON object is required." } };
  }

  for (const field of Object.keys(body)) {
    if (!allowedFields.has(field)) {
      errors[field] = "This field is not allowed.";
    }
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 2 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) {
    errors.name = "Name must be between 2 and 100 characters.";
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const phoneDigits = phone.replace(/\D/g, "");
  if (
    phone.length > 30
    || phoneDigits.length < 7
    || phoneDigits.length > 15
    || !/^[+\d\s().-]+$/.test(phone)
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  const date = typeof body.date === "string" ? body.date : "";
  if (!isCalendarDate(date) || date < todayInIstanbul()) {
    errors.date = "Choose a valid date from today onward.";
  }

  if (typeof body.time !== "string" || !allowedTimes.has(body.time)) {
    errors.time = "Choose a valid reservation time.";
  }

  if (
    typeof body.guests !== "string"
    || !/^(?:[1-9]|1\d|20|20\+)$/.test(body.guests)
  ) {
    errors.guests = "Choose a valid number of guests.";
  }

  if (!["garden", "indoor"].includes(body.area)) {
    errors.area = "Choose a valid seating area.";
  }

  const notes = body.notes === undefined
    ? ""
    : typeof body.notes === "string"
      ? body.notes.trim()
      : null;
  if (notes === null || notes.length > 1000) {
    errors.notes = "Notes must not exceed 1000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    value: {
      name,
      phone,
      date,
      time: body.time,
      guests: body.guests,
      area: body.area,
      notes,
    },
  };
}
