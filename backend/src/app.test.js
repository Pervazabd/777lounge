import assert from "node:assert/strict";
import test from "node:test";
import app from "./app.js";

const server = app.listen(0);
const apiUrl = new Promise((resolve) => {
  server.once("listening", () => {
    resolve(`http://127.0.0.1:${server.address().port}/api`);
  });
});

test.after(() => new Promise((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
}));

test("health endpoint reports that MongoDB is not ready", async () => {
  const response = await fetch(`${await apiUrl}/health`);
  const result = await response.json();

  assert.equal(response.status, 503);
  assert.equal(result.data.database, "disconnected");
});

test("reservation endpoint rejects invalid request data", async () => {
  const response = await fetch(`${await apiUrl}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A", unexpected: true }),
  });
  const result = await response.json();

  assert.equal(response.status, 400);
  assert.equal(result.success, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.unexpected);
});

test("unknown API endpoints return a JSON 404", async () => {
  const response = await fetch(`${await apiUrl}/missing`);
  const result = await response.json();

  assert.equal(response.status, 404);
  assert.equal(result.success, false);
});

test("product endpoint rejects non-scalar category filters", async () => {
  const response = await fetch(`${await apiUrl}/products?category%5B%5D=burgerler`);
  const result = await response.json();

  assert.equal(response.status, 400);
  assert.equal(result.success, false);
});
