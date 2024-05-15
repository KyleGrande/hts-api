// src/services/transaction.routes.ts

import {
  PaymentType,
  PrismaClient,
  Transaction,
  TransactionType,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function createTransaction(
  amount: number,
  type: TransactionType,
  sellerId: number,
  buyerId: number,
  paymentType: PaymentType, // Renamed from 'status' to 'paymentType'
  matchId: number
): Promise<Transaction> {
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      paymentType,
      sellerId,
      buyerId,
      matchId: matchId,
    },
  });
  return transaction;
}

export async function getTransactionById(
  id: number
): Promise<Transaction | null> {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });
  return transaction;
}

export async function updateTransactionById(
  id: number,
  data: {
    amount?: number;
    type?: TransactionType;
    paymentType?: PaymentType;
    sellerId?: number;
    buyerId?: number;
    matchId?: number;
  }
): Promise<Transaction> {
  const updatedTransaction = await prisma.transaction.update({
    where: { id },
    data,
  });
  return updatedTransaction;
}

export async function deleteTransaction(id: number): Promise<Transaction> {
  const deletedTransaction = await prisma.transaction.delete({
    where: { id },
  });
  return deletedTransaction;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany();
  return transactions;
}
