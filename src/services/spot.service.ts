import { Listing, ListingStatus } from "@prisma/client";
import { prisma } from "../utils/spot.util";
import { MyLocation, MyParkingSpot } from "../interfaces/types"; // Ensure the Location type is imported correctly

export async function createParkingSpot(
  userId: number,
  status: ListingStatus,
  availabilityStart: Date,
  price: number,
  region: string,
  subregion: string,
  location: MyLocation
): Promise<MyParkingSpot> {
  const parkingSpot = await prisma.listing.create(
    userId,
    status,
    availabilityStart,
    price,
    region,
    subregion,
    location
  );
  return parkingSpot;
}

export async function getParkingSpotById(id: number): Promise<Listing | null> {
  const parkingSpot = await prisma.listing.findUnique({
    where: { id },
  });
  return parkingSpot;
}

export async function updateParkingSpot(
  id: number,
  data: {
    status?: ListingStatus;
    availabilityStart?: Date;
    price?: number;
    region?: string;
    subregion?: string;
    location?: MyLocation;
  }
): Promise<Listing> {
  const updatedParkingSpot = await prisma.listing.update({
    where: { id },
    data,
  });
  return updatedParkingSpot;
}

export async function deleteParkingSpot(id: number): Promise<Listing> {
  const deletedParkingSpot = await prisma.listing.delete({
    where: { id },
  });
  return deletedParkingSpot;
}

export async function listParkingSpots(): Promise<Listing[]> {
  const parkingSpots = await prisma.listing.findMany();
  return parkingSpots;
}
