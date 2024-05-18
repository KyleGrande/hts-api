// src/service/listing.service.ts

import { Listing, Status } from "@prisma/client";
import { prisma } from "../utils/listing.util";
import { MyLocation, MyListing } from "../interfaces/types"; // Ensure the Location type is imported correctly

export async function createListing(
  userId: number,
  status: Status,
  availabilityStart: Date,
  price: number,
  region: string,
  subregion: string,
  location: MyLocation
): Promise<MyListing> {
  const listing = await prisma.listing.create(
    userId,
    status,
    availabilityStart,
    price,
    region,
    subregion,
    location
  );
  return listing;
}

export async function getListingById(id: number): Promise<Listing | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
  });
  return listing;
}

export async function updateListingById(
  id: number,
  data: {
    status?: Status;
    availabilityStart?: Date;
    price?: number;
    region?: string;
    subregion?: string;
    location?: MyLocation;
  }
): Promise<Listing> {
  const updatedListing = await prisma.listing.update({
    where: { id },
    data,
  });
  return updatedListing;
}

export async function deleteListing(id: number): Promise<Listing> {
  const deletedListing = await prisma.listing.delete({
    where: { id },
  });
  return deletedListing;
}

export async function getAllListings(): Promise<Listing[]> {
  const allListings = await prisma.listing.findMany();
  return allListings;
}
