// src/util/match.util.ts

import { PrismaClient } from "@prisma/client";
import { MyLocation, MyMatch } from "../interfaces/types";

const prisma = new PrismaClient();

interface MatchParams {
  location: MyLocation;
  date: Date;
  entityType: "listing" | "request";
}

export async function findBestMatch({
  location,
  date,
  entityType,
}: MatchParams): Promise<MyMatch | null> {
  if (!["request", "listing"].includes(entityType)) {
    throw new Error("Invalid entityType. Must be 'listing' or 'request'.");
  }

  const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
  const table = entityType === "request" ? "Listing" : "Request";
  const statusCondition =
    entityType === "request"
      ? `'Available'::"ListingStatus"`
      : `'Searching'::"RequestStatus"`;
  const dateField =
    entityType === "request" ? "availabilitystart" : "arrivaltime";

  const relevantEntities = await prisma.$queryRaw<MyMatch[]>`
    SELECT id, ST_Distance(location, ST_GeomFromText(${locationWKT}, 4326)) as distance, ${dateField} as date
    FROM "${table}"
    WHERE ST_DWithin(location, ST_GeomFromText(${locationWKT}, 4326), 402.336)
    AND status = ${statusCondition}
  `;

  let bestMatch: MyMatch | null = null;
  let bestScore = Number.MAX_VALUE;

  for (const entity of relevantEntities) {
    const distanceScore = entity.distance;
    const timeDifference = Math.abs(
      new Date(entity.id).getTime() - date.getTime()
    );
    const score = distanceScore + timeDifference;

    if (score < bestScore) {
      bestScore = score;
      bestMatch = entity;
    }
  }

  return bestMatch;
}
