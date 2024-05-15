// src/routes/transaction.routes.ts

import express from "express";
import * as transactionController from "../controllers/transaction.controller"; // Make sure the path is correct

const router = express.Router();

router.post("/", transactionController.createTransactionController);
router.get("/:id", transactionController.getTransactionByIdController);
router.put("/:id", transactionController.updateTransactionByIdController);
router.delete("/:id", transactionController.deleteTransactionController);
router.get("/", transactionController.getAllTransactionsController);

export default router;
