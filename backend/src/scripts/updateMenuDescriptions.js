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
          $set: { description: item.description },
        },
        upsert: false,
      },
    })),
    { ordered: true },
  );

  if (result.matchedCount !== menuItems.length) {
    throw new Error(
      `Expected to update ${menuItems.length} menu products, but matched ${result.matchedCount}.`,
    );
  }

  console.info(`Menu descriptions updated: ${result.modifiedCount} products.`);
} catch (error) {
  console.error("Could not update menu descriptions:", error);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error("Could not disconnect from MongoDB after description update:", error);
      process.exitCode = 1;
    }
  }
}
