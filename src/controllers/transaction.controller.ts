import { Request, Response, NextFunction } from "express";
import * as transactionService from "../services/transaction.service"; // Ensure path is correct

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { amount, type, sellerId, buyerId, status, matchId } = req.body;
    const transaction = await transactionService.createTransaction(
      amount,
      type,
      sellerId,
      buyerId,
      status,
      matchId
    );
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function getTransactionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const transaction = await transactionService.getTransactionById(id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).send("Transaction not found");
    }
  } catch (error) {
    next(error);
  }
}

export async function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { amount, type, paymentType, sellerId, buyerId, matchId } = req.body;
    const transaction = await transactionService.updateTransaction(id, {
      amount,
      type,
      paymentType,
      sellerId,
      buyerId,
      matchId,
    });
    res.json(transaction);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    await transactionService.deleteTransaction(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listTransactions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const transactions = await transactionService.listTransactions();
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}
