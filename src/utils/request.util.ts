// src/utils/request.util.ts

import { RequestStatus, RequestType, PrismaClient } from "@prisma/client";
import {
  MyLocation,
  MyMatch,
  MyRequest,
  MyListing,
  MyBestMatch,
} from "../interfaces/types";
import { findBestMatch } from "./match.util";
import { createMatchService } from "../services/match.service";
import { updateRequestById } from "../services/request.service";

export const prisma = new PrismaClient().$extends({
  model: {
    request: {
      async create(
        userId: number,
        status: RequestStatus,
        type: RequestType,
        starttime: Date,
        departureTime: Date,
        relist: boolean,
        location: MyLocation,
        bid: number
      ) {
        console.log(relist);
        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        starttime = new Date(starttime);
        departureTime = new Date(departureTime); // Ensure departureTime is a valid Date object
        const request: MyRequest[] = await prisma.$queryRaw`
              INSERT INTO "Request" (userid, status, type, starttime, departuretime, relist, location, bid)
              VALUES (${userId}, ${status}::"RequestStatus", ${type}::"RequestType", ${starttime}, ${departureTime}, ${relist}, ST_GeomFromText(${locationWKT}, 4326), ${bid})
              RETURNING id, userid, status, type, starttime, departuretime, relist, location::text as location, bid`;

        request[0].bid = parseFloat(
          request[0].bid.toFixed(2)
        ) as unknown as number;

        // Find the most relevant listing using the generic function
        const bestMatch = await findBestMatch({
          location,
          starttime: starttime,
          entityType: "request",
        });

        if (bestMatch) {
          console.log("bestMatch", bestMatch);
          createMatchService(request[0].id, bestMatch.id, bestMatch.distance);
          updateRequestById(request[0].id, { status: RequestStatus.Matched });
        }

        return request[0];
      },
    },
  },
});
