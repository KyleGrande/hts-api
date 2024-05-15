// src/util/listing.util.ts

import { Match, Listing, Request, PrismaClient } from "@prisma/client";
import { MyLocation, MyMatch } from "../interfaces/types";
export const prisma = new PrismaClient().$extends({
  model: {
    listing: {
      async findMatch(
        userId: number,
        status: string,
        availabilityStart: Date,
        price: number,
        region: string,
        subregion: string,
        location: MyLocation
      ) {
        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        availabilityStart = new Date(availabilityStart); // Ensure departureTime is a valid Date object
        const match: MyMatch[] = await prisma.$queryRaw`
              INSERT INTO "Match" (userid, status, availabilitystart, price, region, subregion, location)
              VALUES (${userId}, ${status}::"ListingStatus", ${availabilityStart}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
              RETURNING id, userid, status, availabilityStart, price, region, subregion, location::text as location`;
        // match[0].price = parseFloat(
        //   match[0].price.toFixed(2)
        // ) as unknown as number;
        //parkingSpot[0].cost = parkingSpot[0].cost.toFixed(2);
        return match[0];
      },
    },
  },
});
