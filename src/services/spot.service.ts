import { ParkingSpot } from "@prisma/client";
import { prisma } from "../utils/spot.util";
import { MyLocation, MyParkingSpot } from "../interfaces/types"; // Ensure the Location type is imported correctly

export async function createParkingSpot(
  userId: number,
  status: string,
  available: boolean,
  departureTime: Date,
  cost: number,
  type: string,
  location: MyLocation
): Promise<MyParkingSpot> {
  const parkingSpot = await prisma.parkingSpot.create(
    userId,
    status,
    available,
    departureTime,
    cost,
    type,
    location
  );
  return parkingSpot;
}

export async function getParkingSpotById(
  id: number
): Promise<ParkingSpot | null> {
  const parkingSpot = await prisma.parkingSpot.findUnique({
    where: { id },
  });
  return parkingSpot;
}

export async function updateParkingSpot(
  id: number,
  data: {
    status?: string;
    available?: boolean;
    departureTime?: Date;
    cost?: number;
    type?: string;
    location?: MyLocation;
  }
): Promise<ParkingSpot> {
  const updatedParkingSpot = await prisma.parkingSpot.update({
    where: { id },
    data,
  });
  return updatedParkingSpot;
}

export async function deleteParkingSpot(id: number): Promise<ParkingSpot> {
  const deletedParkingSpot = await prisma.parkingSpot.delete({
    where: { id },
  });
  return deletedParkingSpot;
}

export async function listParkingSpots(): Promise<ParkingSpot[]> {
  const parkingSpots = await prisma.parkingSpot.findMany();
  return parkingSpots;
}
