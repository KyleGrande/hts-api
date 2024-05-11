import { Request, Response, NextFunction } from "express";
import * as transactionService from "../services/transaction.service"; // Ensure path is correct

export function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { amount, type, sellerId, buyerId, status, requestId, parkingSpotId } =
    req.body;
  transactionService
    .createTransaction(
      amount,
      type,
      sellerId,
      buyerId,
      status,
      requestId,
      parkingSpotId
    )
    .then((transaction) => res.status(201).json(transaction))
    .catch(next);
}

export function getTransactionById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  transactionService
    .getTransactionById(id)
    .then((transaction) => {
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).send("Transaction not found");
      }
    })
    .catch(next);
}

export function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  const { amount, type, status, requestId, parkingSpotId } = req.body;
  transactionService
    .updateTransaction(id, { amount, type, status, requestId, parkingSpotId })
    .then((transaction) => res.json(transaction))
    .catch(next);
}

export function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  transactionService
    .deleteTransaction(id)
    .then(() => res.status(204).send())
    .catch(next);
}

export function listTransactions(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  transactionService
    .listTransactions()
    .then((transactions) => res.json(transactions))
    .catch(next);
}
