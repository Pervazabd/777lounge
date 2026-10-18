import { MenuItem } from "../models/MenuItem.js";

export async function getMenuItems(request, response) {
  const filter = { isActive: true };

  if (Object.keys(request.query).some((key) => key !== "category")) {
    return response.status(400).json({
      success: false,
      message: "Unsupported product query parameter.",
    });
  }

  if (request.query.category !== undefined) {
    if (
      typeof request.query.category !== "string"
      || !/^[a-z0-9-]+$/.test(request.query.category)
    ) {
      return response.status(400).json({
        success: false,
        message: "Product category must be a valid category slug.",
      });
    }

    filter.category = request.query.category;
  }

  const items = await MenuItem.find(filter)
    .sort({ categoryOrder: 1, itemOrder: 1 })
    .lean();

  return response.json({
    success: true,
    data: {
      items,
    },
  });
}
