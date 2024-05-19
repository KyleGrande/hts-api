// src/index.ts

import express, { Application, Request, Response } from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";

import { PrismaClient } from "@prisma/client";
import { config } from "./config/config";

import router from "./routes/router";
import errorHandler from "./middleware/err.middleware";

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

// Hook up the router
app.use("/api", router);

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
