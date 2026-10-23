import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

function getAllowedOrigins() {
  return [
    "https://seven77lounge-8.onrender.com/api/products",
    ...(process.env.CORS_ORIGIN || "").split(","),
  ]
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || getAllowedOrigins().includes(origin));
  },
}));
app.use(express.json({ limit: "10kb" }));
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler(_request, response) {
    response.status(429).json({
      success: false,
      message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
    });
  },
}));
app.use("/api", apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
