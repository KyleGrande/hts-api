import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST /transactions - Create a new transaction
router.post("/", async (req, res, next) => {
  try {
    const {
      amount,
      type,
      sellerId,
      buyerId,
      status,
      requestId,
      parkingSpotId,
    } = req.body;
    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        sellerId,
        buyerId,
        status,
        requestId,
        parkingSpotId,
      },
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
});

// GET /transactions/:id - Get a transaction by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).send("Transaction not found");
    }
  } catch (error) {
    next(error);
  }
});

// PUT /transactions/:id - Update a transaction by ID
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, status, requestId, parkingSpotId } = req.body;
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        amount,
        type,
        status,
        requestId,
        parkingSpotId,
      },
    });
    res.json(updatedTransaction);
  } catch (error) {
    next(error);
  }
});

// DELETE /transactions/:id - Delete a transaction by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /transactions - List all transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

export default router;
