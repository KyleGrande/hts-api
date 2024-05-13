// src/utils/request.util.ts

import { RequestStatus, RequestType, PrismaClient } from "@prisma/client";
import { MyLocation, MyRequest } from "../interfaces/types";

export const prisma = new PrismaClient().$extends({
  model: {
    request: {
      async create(
        userId: number,
        status: RequestStatus,
        type: RequestType,
        arrivalTime: Date,
        departureTime: Date,
        location: MyLocation,
        bid: number
      ) {
        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        arrivalTime = new Date(arrivalTime);
        departureTime = new Date(departureTime); // Ensure departureTime is a valid Date object
        const request: MyRequest[] = await prisma.$queryRaw`
              INSERT INTO "Request" (userid, status, type, arrivaltime, departuretime, location, bid)
              VALUES (${userId}, ${status}::"RequestStatus", ${type}::"RequestType", ${arrivalTime}, ${departureTime}, ST_GeomFromText(${locationWKT}, 4326), ${bid})
              RETURNING id, userid, status, type, arrivaltime, departuretime, location::text as location, bid`;

        request[0].bid = parseFloat(
          request[0].bid.toFixed(2)
        ) as unknown as number;

        return request[0];
      },
    },
  },
});
