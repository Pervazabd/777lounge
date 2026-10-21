import mongoose from "mongoose";
import { MenuItem } from "../models/MenuItem.js";

const editableFields = [
  "category",
  "categoryName",
  "categoryOrder",
  "name",
  "itemOrder",
  "price",
  "currency",
  "description",
  "ingredients",
  "image",
  "isActive",
];

function getEditableData(body = {}) {
  return Object.fromEntries(
    editableFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]]),
  );
}

function validObjectId(id) {
  return mongoose.isValidObjectId(id);
}

export async function getAdminMenuItems(_request, response) {
  const items = await MenuItem.find()
    .sort({ categoryOrder: 1, itemOrder: 1, name: 1 })
    .lean();

  return response.json({
    success: true,
    data: { items },
  });
}

export async function createMenuItem(request, response) {
  const data = getEditableData(request.body);
  const item = await MenuItem.create(data);

  return response.status(201).json({
    success: true,
    data: { item },
  });
}

export async function reorderMenuItems(request, response) {
  const { category, itemIds } = request.body;
  if (
    typeof category !== "string"
    || !/^[a-z0-9-]+$/.test(category)
    || !Array.isArray(itemIds)
    || itemIds.length === 0
    || !itemIds.every((id) => typeof id === "string" && validObjectId(id))
    || new Set(itemIds).size !== itemIds.length
  ) {
    return response.status(400).json({
      success: false,
      message: "Ürün sıralaması geçersiz.",
    });
  }

  const orderedIds = itemIds.map((id) => new mongoose.Types.ObjectId(id));
  const categoryItems = await MenuItem.find({ category }).select("_id").lean();
  if (
    categoryItems.length !== orderedIds.length
    || categoryItems.some(({ _id }) => !orderedIds.some((id) => id.equals(_id)))
  ) {
    return response.status(400).json({
      success: false,
      message: "Sıralama aynı kategorideki tüm ürünleri içermelidir.",
    });
  }

  await MenuItem.updateMany(
    { category, _id: { $in: orderedIds } },
    [{
      $set: {
        itemOrder: { $add: [{ $indexOfArray: [orderedIds, "$_id"] }, 1] },
      },
    }],
  );

  return response.json({
    success: true,
    data: {},
  });
}

export async function reorderMenuCategories(request, response) {
  const { categories } = request.body;
  if (
    !Array.isArray(categories)
    || categories.length === 0
    || !categories.every((category) => typeof category === "string" && /^[a-z0-9-]+$/.test(category))
    || new Set(categories).size !== categories.length
  ) {
    return response.status(400).json({
      success: false,
      message: "Kategori sıralaması geçersiz.",
    });
  }

  const existingCategories = await MenuItem.distinct("category");
  if (
    existingCategories.length !== categories.length
    || existingCategories.some((category) => !categories.includes(category))
  ) {
    return response.status(400).json({
      success: false,
      message: "Sıralama tüm ürün kategorilerini içermelidir.",
    });
  }

  await MenuItem.updateMany(
    { category: { $in: categories } },
    [{
      $set: {
        categoryOrder: { $add: [{ $indexOfArray: [categories, "$category"] }, 1] },
      },
    }],
  );

  return response.json({
    success: true,
    data: {},
  });
}

export async function updateMenuItem(request, response) {
  if (!validObjectId(request.params.id)) {
    return response.status(400).json({
      success: false,
      message: "Ürün kimliği geçersiz.",
    });
  }

  const data = getEditableData(request.body);
  if (Object.keys(data).length === 0) {
    return response.status(400).json({
      success: false,
      message: "En az bir ürün alanı gerekli.",
    });
  }

  const item = await MenuItem.findByIdAndUpdate(
    request.params.id,
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!item) {
    return response.status(404).json({
      success: false,
      message: "Ürün bulunamadı.",
    });
  }

  return response.json({
    success: true,
    data: { item },
  });
}

export async function deleteMenuItem(request, response) {
  if (!validObjectId(request.params.id)) {
    return response.status(400).json({
      success: false,
      message: "Ürün kimliği geçersiz.",
    });
  }

  const item = await MenuItem.findByIdAndDelete(request.params.id);
  if (!item) {
    return response.status(404).json({
      success: false,
      message: "Ürün bulunamadı.",
    });
  }

  return response.json({
    success: true,
    data: { id: item.id },
  });
}
