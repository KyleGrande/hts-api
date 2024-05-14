// src/util/listing.util.ts

import { ListingStatus, PrismaClient } from "@prisma/client";
import { MyLocation, MyListing } from "../interfaces/types";
// export const prisma = new PrismaClient().$extends({
//   model: {
//     listing: {
//       async create(
//         userId: number,
//         status: ListingStatus,
//         availabilityStart: Date,
//         price: number,
//         region: string,
//         subregion: string,
//         location: MyLocation
//       ) {
//         const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
//         availabilityStart = new Date(availabilityStart); // Ensure departureTime is a valid Date object
//         const listing: MyListing[] = await prisma.$queryRaw`
//               INSERT INTO "Listing" (userid, status, availabilitystart, price, region, subregion, location)
//               VALUES (${userId}, ${status}::"ListingStatus", ${availabilityStart}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
//               RETURNING id, userid, status, availabilityStart, price, region, subregion, location::text as location`;
//         listing[0].price = parseFloat(
//           listing[0].price.toFixed(2)
//         ) as unknown as number;
//         //parkingSpot[0].cost = parkingSpot[0].cost.toFixed(2);
//         return listing[0];
//       },
//     },
//   },
// });
export const prisma = new PrismaClient().$extends({
  model: {
    listing: {
      async create(
        userId: number,
        status: ListingStatus,
        availabilityStart: Date,
        price: number,
        region: string,
        subregion: string,
        location: MyLocation
      ) {
        if (status !== ListingStatus.Available) {
          throw new Error("Listing status must be 'Available' to create a match.");
        }

        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        availabilityStart = new Date(availabilityStart); // Ensure availabilityStart is a valid Date object
        const listing: MyListing[] = await prisma.$queryRaw`
              INSERT INTO "Listing" (userid, status, availabilitystart, price, region, subregion, location)
              VALUES (${userId}, ${status}::"ListingStatus", ${availabilityStart}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
              RETURNING id, userid, status, availabilityStart, price, region, subregion, location::text as location`;

        listing[0].price = parseFloat(listing[0].price.toFixed(2)) as unknown as number;

        // Check for relevant requests within 1/4 mile
        const relevantRequests: any[] = await prisma.$queryRaw`
          SELECT id, ST_Distance(location, ST_GeomFromText(${locationWKT}, 4326)) as distance, arrivaltime
          FROM "Request"
          WHERE ST_DWithin(location, ST_GeomFromText(${locationWKT}, 4326), 402.336)
          AND status = 'Searching'::"RequestStatus"
        `;

        // Find the most relevant request based on distance and time similarity
        let bestMatch = null;
        let bestScore = Number.MAX_VALUE;

        for (const request of relevantRequests) {
          const distanceScore = request.distance;
          const timeDifference = Math.abs(new Date(request.arrivaltime).getTime() - availabilityStart.getTime());
          const score = distanceScore + timeDifference;

          if (score < bestScore) {
            bestScore = score;
            bestMatch = request;
          }
        }

        if (bestMatch) {
          // Create a match for the best request
          await prisma.$queryRaw`
            INSERT INTO "Match" (requestId, listingId, matchedDate, distance)
            VALUES (${bestMatch.id}, ${listing[0].id}, NOW(), ${bestMatch.distance})
          `;
        }

        return listing[0];
      },
    },
  },
});

// old createParkingSpot function
export async function createParkingSpotUsingRawSQL(
  userId: number,
  status: string,
  available: boolean,
  departureTime: Date,
  cost: number,
  type: string,
  location: MyLocation
): Promise<unknown> {
  const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
  console.log(departureTime);
  departureTime = new Date(departureTime);
  console.log(departureTime);
  const parkingSpot =
    await prisma.$queryRaw`INSERT INTO "ParkingSpot" (userid, status, available, departuretime, cost, type, location) VALUES (${userId}, ${status}, ${available}, ${departureTime}, ${cost}, ${type}, ST_GeomFromText(${locationWKT}, 4326))`;
  console.log(parkingSpot);
  return parkingSpot;
}
