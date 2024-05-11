import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST /users - Create a new user
router.post("/", async (req, res, next) => {
  try {
    const { email, name, balance } = req.body;
    const newUser = await prisma.user.create({
      data: { email, name, balance },
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Use next to pass errors to the error handling middleware
  }
});

// GET /users/:id - Get a user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    next(error); // Use next to pass errors to the error handling middleware
  }
});

// PUT /users/:id - Update a user by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, name, balance } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, name, balance },
    });
    res.json(updatedUser);
  } catch (error) {
    next(error); // Use next to pass errors to the error handling middleware
  }
});

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error); // Use next to pass errors to the error handling middleware
  }
});

// GET /users - List all users
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error); // Use next to pass errors to the error handling middleware
  }
});

export default router;
