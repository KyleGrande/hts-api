// src/index.ts
// Importing necessary libraries and middleware
import express, { Application, Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import { config } from "./config/config";

import { PrismaClient } from "@prisma/client";

// import userRoutes from "./routes/userRoutes";
// import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();
const prisma = new PrismaClient();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is up and running!");
});

app.get("/spots", async (req: Request, res: Response) => {
  const spots = await prisma.parkingSpot.findMany();
  res.status(200).send(spots);
});
// app.use("/users", userRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // errorHandler(err, res);
});

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
