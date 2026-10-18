import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDatabase(process.env.MONGODB_URI);

  const server = app.listen(port, () => {
    console.info(`777 Lounge API listening on port ${port}.`);
  });

  const shutdown = (signal) => {
    console.info(`${signal} received; closing the API server.`);
    server.close(async (error) => {
      if (error) {
        console.error("Could not close the API server cleanly:", error);
        process.exitCode = 1;
      }

      try {
        await mongoose.disconnect();
      } catch (disconnectError) {
        console.error("Could not disconnect from MongoDB cleanly:", disconnectError);
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("Could not start the API server:", error);
  process.exitCode = 1;
});
