import { PrismaClient } from "@prisma/client";
import { MyLocation, MyParkingSpot } from "../interfaces/types";
export const prisma = new PrismaClient().$extends({
  model: {
    parkingSpot: {
      async create(
        userId: number,
        status: string,
        available: boolean,
        departureTime: Date,
        cost: number,
        type: string,
        location: MyLocation
      ) {
        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        departureTime = new Date(departureTime); // Ensure departureTime is a valid Date object
        const parkingSpot: MyParkingSpot[] = await prisma.$queryRaw`
              INSERT INTO "ParkingSpot" (userid, status, available, departuretime, cost, type, location)
              VALUES (${userId}, ${status}, ${available}, ${departureTime}, ${cost}, ${type}, ST_GeomFromText(${locationWKT}, 4326))
              RETURNING id, userid, status, available, departuretime, cost, type, location::text as location`;
        parkingSpot[0].cost = parseFloat(
          parkingSpot[0].cost.toFixed(2)
        ) as unknown as number;
        //parkingSpot[0].cost = parkingSpot[0].cost.toFixed(2);
        return parkingSpot[0];
      },
    },
  },
});
