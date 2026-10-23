
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://777lounge4.mrpandomim.workers.dev",
  "https://777loungemenu.com",
  "https://www.777loungemenu.com",
  "https://seven77lounge-8.onrender.com/api/products",
];

const app = express();

app.disable("x-powered-by");

// CORS middleware must run before API routes.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(helmet());

app.use(express.json({ limit: "10kb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler(_request, response) {
      response.status(429).json({
        success: false,
        message:
          "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
      });
    },
  })
);

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
