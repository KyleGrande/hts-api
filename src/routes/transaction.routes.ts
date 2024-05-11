import express from "express";
import * as transactionController from "../controllers/transaction.controller"; // Make sure the path is correct

const router = express.Router();

router.post("/", transactionController.createTransaction);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);
router.get("/", transactionController.listTransactions);

export default router;
