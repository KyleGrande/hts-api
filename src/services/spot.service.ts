import { PrismaClient, ParkingSpot, Prisma } from "@prisma/client";
import { MyLocation } from "../interfaces/types"; // Ensure the Location type is imported correctly

const prisma = new PrismaClient();

export async function createParkingSpotUsingRawSQL(
  userId: number,
  status: string,
  available: boolean,
  departureTime: Date,
  cost: number,
  type: string,
  location: MyLocation
): Promise<number> {
  const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
  console.log(departureTime);
  departureTime = new Date(departureTime);
  console.log(departureTime);
  const parkingSpot =
    await prisma.$executeRaw`INSERT INTO "ParkingSpot" (userid, status, available, departuretime, cost, type, location) VALUES (${userId}, ${status}, ${available}, ${departureTime}, ${cost}, ${type}, ST_GeomFromText(${locationWKT}, 4326))`;
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
