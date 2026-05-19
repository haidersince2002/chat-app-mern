import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./src/lib/db.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { app, server } from "./src/lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: { message: "Too many requests, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// In dev: allow any localhost port (handles Vite port collisions)
// In prod: allow only the exact CLIENT_URL from env
const allowedOrigin = (origin, callback) => {
  if (!origin) return callback(null, true); // server-to-server / curl
  const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
  if (process.env.NODE_ENV !== "production" && isLocalhost) {
    return callback(null, true);
  }
  if (origin === process.env.CLIENT_URL) {
    return callback(null, true);
  }
  callback(new Error(`CORS: origin ${origin} not allowed`));
};

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is running on port:", PORT);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to DB:", error);
  });
