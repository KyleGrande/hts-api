// src/index.ts
// Importing necessary libraries and middleware
import express, { Application, Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import { config } from "./config/config";

import { PrismaClient } from "@prisma/client";

import userRoutes from "./routes/user.routes";
import transactionRoutes from "./routes/transaction.routes";
import parkingSpotRoutes from "./routes/spot.routes";
import requestRoutes from "./routes/request.routes";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();
const prisma = new PrismaClient();

// Middleware for parsing JSON and urlencoded data and enabling CORS
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Basic route to check server status
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is up and running!");
});

// Route handlers
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/parkingspots", parkingSpotRoutes);
app.use("/requests", requestRoutes);

// Error handling middleware usage
app.use(errorHandler);

// Function to start the server and connect to the database
async function startServer() {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log("Database connected successfully.");

    // Start the Express server
    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit process if server fails to start
  }
}

// Call startServer to initiate everything
startServer();
