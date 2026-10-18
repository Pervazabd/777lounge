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

test("rejects invalid fields and unknown properties", () => {
  const result = validateReservation(validReservation({
    date: "2026-02-30",
    time: "09:15",
    area: "balcony",
    admin: true,
  }));

  assert.ok(result.errors.date);
  assert.ok(result.errors.time);
  assert.ok(result.errors.area);
  assert.ok(result.errors.admin);
});

test("rejects non-object request bodies", () => {
  assert.deepEqual(validateReservation([]), {
    errors: { body: "A JSON object is required." },
  });
});
