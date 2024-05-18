// src/util/match.util.ts

// import { Match, Listing, Request, PrismaClient } from "@prisma/client";
// import { MyLocation, MyMatch } from "../interfaces/types";
// export const prisma = new PrismaClient().$extends({
//   model: {
//     listing: {
//       async findMatch(
//         userId: number,
//         status: string,
//         availabilityStart: Date,
//         price: number,
//         region: string,
//         subregion: string,
//         location: MyLocation
//       ) {
//         const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
//         availabilityStart = new Date(availabilityStart); // Ensure departureTime is a valid Date object
//         const match: MyMatch[] = await prisma.$queryRaw`
//               INSERT INTO "Match" (userid, status, availabilitystart, price, region, subregion, location)
//               VALUES (${userId}, ${status}::"ListingStatus", ${availabilityStart}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
//               RETURNING id, userid, status, availabilityStart, price, region, subregion, location::text as location`;
//         // match[0].price = parseFloat(
//         //   match[0].price.toFixed(2)
//         // ) as unknown as number;
//         //parkingSpot[0].cost = parkingSpot[0].cost.toFixed(2);
//         return match[0];
//       },
//     },
//   },
// });

import { PrismaClient } from "@prisma/client";
import { MyLocation } from "../interfaces/types";

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
}: MatchParams) {
  const locationWKT = `POINT(${location.longitude} ${location.latitude})`;

  let query;
  const table = entityType === "request" ? "Listing" : "Request";
  const statusCondition =
    entityType === "request"
      ? `'Available'::"ListingStatus"`
      : `'Searching'::"RequestStatus"`;
  const dateField =
    entityType === "request" ? "availabilitystart" : "arrivaltime";

  query = prisma.$queryRaw`
    SELECT id, ST_Distance(location, ST_GeomFromText(${locationWKT}, 4326)) as distance, ${dateField} as date
    FROM "${table}"
    WHERE ST_DWithin(location, ST_GeomFromText(${locationWKT}, 4326), 402.336)
    AND status = ${statusCondition}
  `;

  if (!["request", "listing"].includes(entityType)) {
    throw new Error("Invalid entityType. Must be 'listing' or 'request'.");
  }

  const relevantEntities: any[] = (await query) as any[];

  let bestMatch = null;
  let bestScore = Number.MAX_VALUE;

  for (const entity of relevantEntities) {
    const distanceScore = entity.distance;
    const timeDifference = Math.abs(
      new Date(entity.date).getTime() - date.getTime()
    );
    const score = distanceScore + timeDifference;

    if (score < bestScore) {
      bestScore = score;
      bestMatch = entity;
    }
  }

  return bestMatch;
}
