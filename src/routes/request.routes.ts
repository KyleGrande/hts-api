import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST /requests - Create a new request
router.post("/", async (req, res, next) => {
  try {
    const { userId, status, arrivalTime, departureTime, bid, type } = req.body;
    const newRequest = await prisma.request.create({
      data: { userId, status, arrivalTime, departureTime, bid, type },
    });
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
});

// GET /requests/:id - Get a request by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({
      where: { id: Number(id) },
    });
    if (request) {
      res.json(request);
    } else {
      res.status(404).send("Request not found");
    }
  } catch (error) {
    next(error);
  }
});

// PUT /requests/:id - Update a request by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, arrivalTime, departureTime, bid, type } = req.body;
    const updatedRequest = await prisma.request.update({
      where: { id: Number(id) },
      data: { status, arrivalTime, departureTime, bid, type },
    });
    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

// DELETE /requests/:id - Delete a request by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.request.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /requests - List all requests
router.get("/", async (req, res, next) => {
  try {
    const requests = await prisma.request.findMany();
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

export default router;
