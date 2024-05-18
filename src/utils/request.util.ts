// src/utils/request.util.ts

import { RequestStatus, RequestType, PrismaClient } from "@prisma/client";
import {
  MyLocation,
  MyMatch,
  MyRequest,
  MyListing,
  bestMatch,
} from "../interfaces/types";
import { findBestMatchForRequest } from "./matchForRequest.util"; // Import the new utility function

export const prisma = new PrismaClient().$extends({
  model: {
    request: {
      async create(
        userId: number,
        status: RequestStatus,
        type: RequestType,
        arrivalTime: Date,
        departureTime: Date,
        relist: boolean,
        location: MyLocation,
        bid: number
      ) {
        console.log(relist);
        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        arrivalTime = new Date(arrivalTime);
        departureTime = new Date(departureTime); // Ensure departureTime is a valid Date object
        const request: MyRequest[] = await prisma.$queryRaw`
              INSERT INTO "Request" (userid, status, type, arrivaltime, departuretime, relist, location, bid)
              VALUES (${userId}, ${status}::"RequestStatus", ${type}::"RequestType", ${arrivalTime}, ${departureTime}, ${relist}, ST_GeomFromText(${locationWKT}, 4326), ${bid})
              RETURNING id, userid, status, type, arrivaltime, departuretime, relist, location::text as location, bid`;

        request[0].bid = parseFloat(
          request[0].bid.toFixed(2)
        ) as unknown as number;

        // Find the most relevant listing using the separate function
        const bestMatch: bestMatch = await findBestMatchForRequest(
          location,
          arrivalTime
        );

        if (bestMatch) {
          // Create a match for the best listing
          const result: MyMatch = await prisma.$queryRaw`
            INSERT INTO "Match" ("requestId", "listingId", "matchedDate", "distance")
            VALUES (${request[0].id}, ${bestMatch.id}, NOW(), ${bestMatch.distance})
          `;
        }

        return request[0];
      },
    },
  },
});

// async findListingMatch(
//   userId: number,
//   status: RequestStatus,
//   type: RequestType,
//   arrivalTime: Date,
//   departureTime: Date,
//   location: MyLocation,
//   bid: number
// ) {
//   const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
//   arrivalTime = new Date(arrivalTime);
//   departureTime = new Date(departureTime); // Ensure departureTime is a valid Date object
//   const request: MyRequest[] = await prisma.$queryRaw`
//         INSERT INTO "Request" (userid, status, type, arrivaltime, departuretime, location, bid)
//         VALUES (${userId}, ${status}::"RequestStatus", ${type}::"RequestType", ${arrivalTime}, ${departureTime}, ST_GeomFromText(${locationWKT}, 4326), ${bid})
//         RETURNING id, userid, status, type, arrivaltime, departuretime, location::text as location, bid`;

//   request[0].bid = parseFloat(
//     request[0].bid.toFixed(2)
//   ) as unknown as number;

//   return request[0];
// },
