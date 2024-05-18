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

  // Construct the query string with dynamic table name and date field
  const queryString = `
    SELECT id, ST_Distance(location, ST_GeomFromText($1, 4326)) as distance, ${dateField} as date
    FROM "${table}"
    WHERE ST_DWithin(location, ST_GeomFromText($1, 4326), 402.336)
    AND status = ${statusCondition}
  `;

  const query: MyMatch[] = await prisma.$queryRawUnsafe<MyMatch[]>(
    queryString,
    locationWKT
  );

  let bestMatch: MyMatch | null = null;
  let bestScore = Number.MAX_VALUE;

  for (const entity of query) {
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
