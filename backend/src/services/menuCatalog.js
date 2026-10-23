import { menuItems } from "../data/menuItems.js";
import { MenuItem } from "../models/MenuItem.js";

export async function ensureMenuCatalog() {
  const itemCount = await MenuItem.estimatedDocumentCount();
  if (itemCount > 0) {
    return;
  }

  const result = await MenuItem.bulkWrite(
    menuItems.map((item) => ({
      updateOne: {
        filter: {
          category: item.category,
          name: item.name,
        },
        update: {
          $setOnInsert: item,
        },
        upsert: true,
      },
    })),
    { ordered: true },
  );

  console.info(
    `Initial MongoDB menu catalog created: ${result.upsertedCount} products.`,
  );
}
