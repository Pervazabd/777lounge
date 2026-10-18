import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  const options = process.env.MONGODB_DB_NAME
    ? { dbName: process.env.MONGODB_DB_NAME }
    : {};

  await mongoose.connect(uri, options);
  console.info("Connected to MongoDB.");
}
