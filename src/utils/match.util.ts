// src/utils/match.util.ts

import { PrismaClient, Prisma } from "@prisma/client";
import { MyBestMatch, MyLocation } from "../interfaces/types";

const prisma = new PrismaClient();

interface MatchParams {
  location: MyLocation;
  starttime: Date;
  searchType: "Listing" | "Request";
  userId: number;
}

export async function findBestMatch({
  location,
  starttime,
  searchType,
  userId,
}: MatchParams): Promise<MyBestMatch | null> {
  if (!["Listing", "Request"].includes(searchType)) {
    throw new Error("Invalid entityType. Must be 'listing' or 'request'.");
  }

  const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
  const table = searchType;
  const statusCondition =
    searchType === "Listing"
      ? `'Available'::"ListingStatus"`
      : `'Searching'::"RequestStatus"`;

  const query = await prisma.$queryRaw<MyBestMatch[]>`
    SELECT id, ST_Distance(location, ST_GeomFromText(${locationWKT}, 4326)) as distance, starttime as date
    FROM ${Prisma.raw(`"${table}"`)}
    WHERE ST_DWithin(location, ST_GeomFromText(${locationWKT}, 4326), 402.336)
    AND status = ${Prisma.raw(statusCondition)}
    AND userid <> ${userId}
  `;

  let bestMatch: MyBestMatch | null = null;
  let bestScore = Number.MAX_VALUE;

  for (const entity of query) {
    const distanceScore = entity.distance;
    const timeDifference = Math.abs(
      new Date(entity.id).getTime() - starttime.getTime()
    );
    const score = distanceScore + timeDifference;

    if (score < bestScore) {
      bestScore = score;
      bestMatch = entity;
    }
  }

  return bestMatch;
}
