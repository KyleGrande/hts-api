import express from "express";
import { PrismaClient } from "@prisma/client";
import { Location } from "../interfaces/types";

const router = express.Router();
const prisma = new PrismaClient();

// POST /parkingspots - Create a new parking spot
router.post("/", async (req, res, next) => {
  try {
    const { userId, status, available, departureTime, cost, type, location } =
      req.body;
    const newParkingSpot = await prisma.parkingSpot.create({
      data: { userId, status, available, departureTime, cost, type, location },
    });
    res.status(201).json(newParkingSpot);
  } catch (error) {
    next(error);
  }
});

// GET /parkingspots/:id - Get a parking spot by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const parkingSpot = await prisma.parkingSpot.findUnique({
      where: { id: Number(id) },
    });
    if (parkingSpot) {
      res.json(parkingSpot);
    } else {
      res.status(404).send("Parking spot not found");
    }
  } catch (error) {
    next(error);
  }
});

// PUT /parkingspots/:id - Update a parking spot by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, available, departureTime, cost, type, location } = req.body;
    const updatedParkingSpot = await prisma.parkingSpot.update({
      where: { id: Number(id) },
      data: { status, available, departureTime, cost, type, location },
    });
    res.json(updatedParkingSpot);
  } catch (error) {
    next(error);
  }
});

// DELETE /parkingspots/:id - Delete a parking spot by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.parkingSpot.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /parkingspots - List all parking spots
router.get("/", async (req, res, next) => {
  try {
    const parkingSpots = await prisma.parkingSpot.findMany();
    res.json(parkingSpots);
  } catch (error) {
    next(error);
  }
});

export default router;
