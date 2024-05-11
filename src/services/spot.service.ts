import { PrismaClient, ParkingSpot } from "@prisma/client";
import { Location } from "../interfaces/types"; // Ensure the Location type is imported correctly

const prisma = new PrismaClient();

export function createParkingSpot(
  userId: number,
  status: string,
  available: boolean,
  departureTime: Date,
  cost: number,
  type: string,
  location: Location
): Promise<ParkingSpot> {
  return prisma.parkingSpot.create({
    data: {
      userId,
      status,
      available,
      departureTime,
      cost,
      type,
      location: Location,
    },
  });
}

export function getParkingSpotById(id: number): Promise<ParkingSpot | null> {
  return prisma.parkingSpot.findUnique({
    where: { id },
  });
}

export function updateParkingSpot(
  id: number,
  data: {
    status?: string;
    available?: boolean;
    departureTime?: Date;
    cost?: number;
    type?: string;
    location?: Location;
  }
): Promise<ParkingSpot> {
  return prisma.parkingSpot.update({
    where: { id },
    data,
  });
}

export function deleteParkingSpot(id: number): Promise<ParkingSpot> {
  return prisma.parkingSpot.delete({
    where: { id },
  });
}

export function listParkingSpots(): Promise<ParkingSpot[]> {
  return prisma.parkingSpot.findMany();
}
