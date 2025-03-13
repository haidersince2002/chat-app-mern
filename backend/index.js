import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/lib/db.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
import { app, server } from "./src/lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" })); // Increase to 10MB or as needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
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
