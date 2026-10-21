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

test("admin reservations endpoint rejects an invalid admin key", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/reservations/admin`, {
      headers: { "X-Admin-Key": "incorrect-key" },
    });
    const result = await response.json();

    assert.equal(response.status, 401);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
});

test("admin reservation cancellation rejects an invalid reservation id", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/reservations/admin/not-an-id/cancel`, {
      method: "PATCH",
      headers: { "X-Admin-Key": "test-admin-key" },
    });
    const result = await response.json();

    assert.equal(response.status, 400);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
});

test("admin reservation deletion rejects an invalid reservation id", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/reservations/admin/not-an-id`, {
      method: "DELETE",
      headers: { "X-Admin-Key": "test-admin-key" },
    });
    const result = await response.json();

    assert.equal(response.status, 400);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
});

test("admin delete-all reservations endpoint requires a valid admin key", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/reservations/admin/all`, {
      method: "DELETE",
      headers: { "X-Admin-Key": "incorrect-key" },
    });
    const result = await response.json();

    assert.equal(response.status, 401);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
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

test("admin product endpoint rejects an invalid admin key", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/products/admin`, {
      headers: { "X-Admin-Key": "incorrect-key" },
    });
    const result = await response.json();

    assert.equal(response.status, 401);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
});

test("admin reorder endpoint rejects an empty product order", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/products/admin/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": "test-admin-key",
      },
      body: JSON.stringify({ category: "manti", itemIds: [] }),
    });
    const result = await response.json();

    assert.equal(response.status, 400);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
});

test("admin category reorder endpoint rejects an empty category order", async () => {
  const originalAdminKey = process.env.ADMIN_API_KEY;
  process.env.ADMIN_API_KEY = "test-admin-key";

  try {
    const response = await fetch(`${await apiUrl}/products/admin/reorder-categories`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": "test-admin-key",
      },
      body: JSON.stringify({ categories: [] }),
    });
    const result = await response.json();

    assert.equal(response.status, 400);
    assert.equal(result.success, false);
  } finally {
    if (originalAdminKey === undefined) {
      delete process.env.ADMIN_API_KEY;
    } else {
      process.env.ADMIN_API_KEY = originalAdminKey;
    }
  }
});
