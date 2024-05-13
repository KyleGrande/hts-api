// src/services/request.service.ts

import { Request, RequestStatus, RequestType } from "@prisma/client";
import { prisma } from "../utils/request.util";
import { MyLocation, MyRequest } from "../interfaces/types";

export async function createRequest(
  userid: number,
  status: RequestStatus,
  type: RequestType,
  arrivalTime: Date,
  departureTime: Date,
  location: MyLocation,
  bid: number
): Promise<MyRequest> {
  try {
    const request = await prisma.request.create(
      userid,
      status,
      type,
      arrivalTime,
      departureTime,
      location,
      bid
    );
    return request;
  } catch (error) {
    // Handle or log the error as needed
    throw error;
  }
}

export async function getRequestById(id: number): Promise<Request | null> {
  const request = await prisma.request.findUnique({
    where: { id },
    include: { user: true }, // Include related user and transactions data
  });
  return request;
}

export async function updateRequestById(
  id: number,
  data: {
    status?: RequestStatus;
    type?: RequestType;
    arrivalTime?: Date;
    departureTime?: Date;
    location?: MyLocation;
    bid?: number;
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

export async function getAllRequest(): Promise<Request[]> {
  const request = prisma.request.findMany({
    include: { user: true }, // Include related user and transactions data
  });
  return request;
}
