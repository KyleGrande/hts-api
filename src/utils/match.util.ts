import { PrismaClient } from "@prisma/client";
import { MyBestMatch, MyLocation, MyMatch } from "../interfaces/types";

const prisma = new PrismaClient();

interface MatchParams {
  location: MyLocation;
  starttime: Date;
  entityType: "listing" | "request";
  userId: number;
}

export async function findBestMatch({
  location,
  starttime,
  entityType,
  userId,
}: MatchParams): Promise<MyBestMatch | null> {
  if (!["request", "listing"].includes(entityType)) {
    throw new Error("Invalid entityType. Must be 'listing' or 'request'.");
  }

  const locationWKT = `POINT(${location.longitude} ${location.latitude})`;

  const table = entityType === "request" ? "Listing" : "Request";
  const statusCondition =
    entityType === "request"
      ? `'Available'::"ListingStatus"`
      : `'Searching'::"RequestStatus"`;

  // Construct the query string with dynamic table name, date field, and userId exclusion
  const queryString = `
    SELECT id, ST_Distance(location, ST_GeomFromText('${locationWKT}', 4326)) as distance, starttime as date
    FROM "${table}"
    WHERE ST_DWithin(location, ST_GeomFromText('${locationWKT}', 4326), 402.336)
    AND status = ${statusCondition}
    AND userid <> ${userId}
  `;

  const query: MyBestMatch[] = await prisma.$queryRawUnsafe<MyBestMatch[]>(
    queryString
  );

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
