import assert from "node:assert/strict";
import test from "node:test";
import { MenuItem } from "./MenuItem.js";

const validProduct = {
  category: "burgerler",
  categoryName: "Burgerler",
  categoryOrder: 1,
  name: "Hamburger",
  itemOrder: 1,
  price: 290,
  currency: "TRY",
  description: "Hamburger",
  ingredients: [" Ekmek ", "Köfte"],
  image: {
    url: "https://example.com/burger.jpg",
    alt: "Hamburger",
    source: "777 Lounge",
  },
  isActive: true,
};

test("menu product schema accepts and normalizes a valid product", () => {
  const product = new MenuItem(validProduct);

  assert.equal(product.validateSync(), undefined);
  assert.deepEqual(product.ingredients, ["Ekmek", "Köfte"]);
  assert.equal(product.image._id, undefined);
});

test("menu product schema rejects invalid order numbers and image URLs", () => {
  const product = new MenuItem({
    ...validProduct,
    categoryOrder: 1.5,
    itemOrder: 0,
    image: { ...validProduct.image, url: "javascript:alert(1)" },
  });
  const error = product.validateSync();

  assert.ok(error);
  assert.ok(error.errors.categoryOrder);
  assert.ok(error.errors.itemOrder);
  assert.ok(error.errors["image.url"]);
});
