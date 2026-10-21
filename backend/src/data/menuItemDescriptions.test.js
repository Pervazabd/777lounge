import assert from "node:assert/strict";
import test from "node:test";
import { menuItems } from "./menuItems.js";
import { menuItemDescriptions } from "./menuItemDescriptions.js";

test("every menu product has a researched description", () => {
  assert.equal(Object.keys(menuItemDescriptions).length, menuItems.length);

  for (const item of menuItems) {
    assert.ok(menuItemDescriptions[item.name], `Missing description for ${item.name}`);
    assert.equal(item.description, menuItemDescriptions[item.name]);
  }
});
