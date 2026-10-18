import assert from "node:assert/strict";
import test from "node:test";
import { menuItems } from "./menuItems.js";

test("menu catalog contains the complete, uniquely ordered catalog", () => {
  assert.equal(menuItems.length, 158);
  assert.equal(new Set(menuItems.map(({ category, name }) => `${category}:${name}`)).size, menuItems.length);
  assert.equal(new Set(menuItems.map(({ categoryOrder }) => categoryOrder)).size, 26);

  for (const item of menuItems) {
    assert.ok(item.category);
    assert.ok(item.categoryName);
    assert.ok(item.description);
    assert.ok(Number.isInteger(item.price));
    assert.equal(item.currency, "TRY");
    assert.match(item.image.url, /^https:\/\/images\.unsplash\.com\/photo-/);
    assert.ok(item.image.alt);
  }
});

test("menu catalog preserves key names, prices, and listed contents", () => {
  const byName = new Map(menuItems.map((item) => [item.name, item]));

  assert.equal(byName.get("Mantı").price, 225);
  assert.deepEqual(byName.get("777 Special Tost").ingredients, [
    "Zeytin ezmesi",
    "Beyaz peynir",
    "Kaşar",
    "Domates",
    "Roka",
    "Patates kızartması",
  ]);
  assert.deepEqual(byName.get("Cindirella").ingredients, [
    "Portakal suyu",
    "Limonata",
    "Ananas suyu",
    "Nar şurubu",
    "Hindistan cevizi şurubu",
  ]);
  assert.equal(byName.get("Hızlı Şarj").price, 75);
});
