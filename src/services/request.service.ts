import { PrismaClient, Request } from "@prisma/client";

const prisma = new PrismaClient();

export async function createRequest(
  userId: number,
  status: string,
  arrivalTime: Date,
  departureTime: Date,
  bid: number,
  type: string
): Promise<Request> {
  try {
    const request = await prisma.request.create({
      data: {
        userId,
        status,
        arrivalTime,
        departureTime,
        bid,
        type,
      },
    });
    return request;
  } catch (error) {
    // Handle or log the error as needed
    throw error;
  }
}

export async function getRequestById(id: number): Promise<Request | null> {
  const request = await prisma.request.findUnique({
    where: { id },
    include: { user: true, transactions: true }, // Include related user and transactions data
  });
  return request;
}

export async function updateRequest(
  id: number,
  data: {
    status?: string;
    arrivalTime?: Date;
    departureTime?: Date;
    bid?: number;
    type?: string;
  }
): Promise<Request> {
  const request = await prisma.request.update({
    where: { id },
    data,
  });
  return request;
}

export async function deleteRequest(id: number): Promise<Request> {
  const request = await prisma.request.delete({
    where: { id },
  });
  return request;
}

export async function listRequests(): Promise<Request[]> {
  const request = prisma.request.findMany({
    include: { user: true, transactions: true }, // Include related user and transactions data
  });
  return request;
}
