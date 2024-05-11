import { PrismaClient, Transaction } from "@prisma/client";

const prisma = new PrismaClient();

export function createTransaction(
  amount: number,
  type: string,
  sellerId: number,
  buyerId: number,
  status: string,
  requestId: number,
  parkingSpotId: number
): Promise<Transaction> {
  return prisma.transaction.create({
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
}

export function getTransactionById(id: number): Promise<Transaction | null> {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

export function updateTransaction(
  id: number,
  data: {
    amount?: number;
    type?: string;
    status?: string;
    requestId?: number;
    parkingSpotId?: number;
  }
): Promise<Transaction> {
  return prisma.transaction.update({
    where: { id },
    data,
  });
}

export function deleteTransaction(id: number): Promise<Transaction> {
  return prisma.transaction.delete({
    where: { id },
  });
}

export function listTransactions(): Promise<Transaction[]> {
  return prisma.transaction.findMany();
}
