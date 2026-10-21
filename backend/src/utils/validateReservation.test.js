import assert from "node:assert/strict";
import test from "node:test";
import { validateReservation } from "./validateReservation.js";

function validReservation(overrides = {}) {
  return {
    name: "Jane Doe",
    phone: "+90 555 123 4567",
    date: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
    time: "19:30",
    guests: "2",
    area: "garden",
    notes: "Birthday",
    ...overrides,
  };
}

test("accepts and normalizes a valid reservation", () => {
  const result = validateReservation(validReservation({
    name: "  Jane Doe  ",
    notes: "  Birthday  ",
  }));

  assert.equal(result.errors, undefined);
  assert.equal(result.value.name, "Jane Doe");
  assert.equal(result.value.notes, "Birthday");
});

test("accepts manually entered times and guest counts with every seating area", () => {
  for (const area of ["garden", "indoor", "game-room"]) {
    const result = validateReservation(validReservation({
      time: "19:45",
      guests: "35",
      area,
    }));

    assert.equal(result.errors, undefined);
    assert.equal(result.value.time, "19:45");
    assert.equal(result.value.guests, "35");
    assert.equal(result.value.area, area);
  }
});

test("accepts the existing suggested time and 20-plus guest option", () => {
  const result = validateReservation(validReservation({
    time: "19:30",
    guests: "20+",
  }));

  assert.equal(result.errors, undefined);
});

test("rejects invalid fields and unknown properties", () => {
  const result = validateReservation(validReservation({
    date: "2026-02-30",
    time: "25:15",
    area: "balcony",
    admin: true,
  }));

  assert.ok(result.errors.date);
  assert.ok(result.errors.time);
  assert.ok(result.errors.area);
  assert.ok(result.errors.admin);
});

test("rejects malformed manually entered times and guest counts", () => {
  const result = validateReservation(validReservation({
    time: "24:00",
    guests: "1000",
  }));

  assert.ok(result.errors.time);
  assert.ok(result.errors.guests);
});

test("rejects non-object request bodies", () => {
  assert.deepEqual(validateReservation([]), {
    errors: { body: "A JSON object is required." },
  });
});
