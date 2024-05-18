// src/util/listing.util.ts

import { Status, PrismaClient } from "@prisma/client";
import { MyLocation, MyListing } from "../interfaces/types";
import { findBestMatch } from "./match.util";
import { createMatchService } from "../services/match.service";
import { updateListingById } from "../services/listing.service";
import { updateRequestById } from "../services/request.service";

export const prisma = new PrismaClient().$extends({
  model: {
    listing: {
      async create(
        userId: number,
        status: Status,
        starttime: Date,
        price: number,
        region: string,
        subregion: string,
        location: MyLocation
      ) {
        if (status !== Status.Searching) {
          throw new Error(
            "Listing status must be 'Available' to create a match."
          );
        }

        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        starttime = new Date(starttime); // Ensure availabilityStart is a valid Date object
        const listing: MyListing[] = await prisma.$queryRaw`
              INSERT INTO "Listing" (userid, status, starttime, price, region, subregion, location)
              VALUES (${userId}, ${status}::"Status", ${starttime}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
              RETURNING id, userid, status, starttime, price, region, subregion, location::text as location`;

        listing[0].price = parseFloat(
          listing[0].price.toFixed(2)
        ) as unknown as number;

        // Find the most relevant request using the generic function
        const bestMatch = await findBestMatch({
          locationWKT,
          starttime: starttime,
          searchType: "Request",
          userId,
        });

        if (bestMatch) {
          console.log("bestMatch", bestMatch);
          createMatchService(bestMatch.id, listing[0].id, bestMatch.distance);
          updateListingById(listing[0].id, { status: Status.Matched });
          updateRequestById(bestMatch.id, { status: Status.Matched });
          listing[0].match = {
            id: bestMatch.id,
            distance: bestMatch.distance,
          };
        }
        return listing[0];
      },
    },
  },
});
