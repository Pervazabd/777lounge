import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { menuItems } from "../data/menuItems.js";
import { MenuItem } from "../models/MenuItem.js";

try {
  await connectDatabase(process.env.MONGODB_URI);

  const result = await MenuItem.bulkWrite(
    menuItems.map((item) => ({
      updateOne: {
        filter: {
          category: item.category,
          name: item.name,
        },
        update: {
          $set: item,
        },
        upsert: true,
      },
    })),
    { ordered: true },
  );

  console.info(
    `Menu seed complete: ${menuItems.length} products (${result.upsertedCount} inserted, ${result.modifiedCount} updated).`,
  );
} catch (error) {
  console.error("Could not seed the menu:", error);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error("Could not disconnect from MongoDB after menu seed:", error);
      process.exitCode = 1;
    }
  }
}
