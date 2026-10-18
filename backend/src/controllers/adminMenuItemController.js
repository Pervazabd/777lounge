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
