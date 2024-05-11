import { PrismaClient, Request } from "@prisma/client";

const prisma = new PrismaClient();

export function createRequest(
  userId: number,
  status: string,
  arrivalTime: Date,
  departureTime: Date,
  bid: number,
  type: string
): Promise<Request> {
  return prisma.request.create({
    data: {
      userId,
      status,
      arrivalTime,
      departureTime,
      bid,
      type,
    },
  });
}

export function getRequestById(id: number): Promise<Request | null> {
  return prisma.request.findUnique({
    where: { id },
    include: { user: true, transactions: true }, // Include related user and transactions data
  });
}

export function updateRequest(
  id: number,
  data: {
    status?: string;
    arrivalTime?: Date;
    departureTime?: Date;
    bid?: number;
    type?: string;
  }
): Promise<Request> {
  return prisma.request.update({
    where: { id },
    data,
  });
}

export function deleteRequest(id: number): Promise<Request> {
  return prisma.request.delete({
    where: { id },
  });
}

export function listRequests(): Promise<Request[]> {
  return prisma.request.findMany({
    include: { user: true, transactions: true }, // Include related user and transactions data
  });
}
