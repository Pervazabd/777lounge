import mongoose from "mongoose";

export function getHealth(_request, response) {
  const databaseConnected = mongoose.connection.readyState === 1;
  const status = databaseConnected ? 200 : 503;

  response.status(status).json({
    success: databaseConnected,
    data: {
      status: databaseConnected ? "ok" : "unavailable",
      database: databaseConnected ? "connected" : "disconnected",
    },
  });
}
