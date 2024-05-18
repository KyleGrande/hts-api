// src/util/listing.util.ts

import { ListingStatus, PrismaClient, RequestStatus } from "@prisma/client";
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
        status: ListingStatus,
        starttime: Date,
        price: number,
        region: string,
        subregion: string,
        location: MyLocation
      ) {
        if (status !== ListingStatus.Available) {
          throw new Error(
            "Listing status must be 'Available' to create a match."
          );
        }

        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        starttime = new Date(starttime); // Ensure availabilityStart is a valid Date object
        const listing: MyListing[] = await prisma.$queryRaw`
              INSERT INTO "Listing" (userid, status, starttime, price, region, subregion, location)
              VALUES (${userId}, ${status}::"ListingStatus", ${starttime}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
              RETURNING id, userid, status, starttime, price, region, subregion, location::text as location`;

        listing[0].price = parseFloat(
          listing[0].price.toFixed(2)
        ) as unknown as number;

        // Find the most relevant request using the generic function
        const bestMatch = await findBestMatch({
          location,
          starttime: starttime,
          searchType: "Request",
          userId,
        });

        if (bestMatch) {
          console.log("bestMatch", bestMatch);
          createMatchService(bestMatch.id, listing[0].id, bestMatch.distance);
          updateListingById(listing[0].id, { status: ListingStatus.Occupied });
          updateRequestById(bestMatch.id, { status: RequestStatus.Matched });
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
