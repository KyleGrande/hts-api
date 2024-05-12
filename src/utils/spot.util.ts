import { ListingStatus, PrismaClient } from "@prisma/client";
import { MyLocation, MyParkingSpot } from "../interfaces/types";
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
        const locationWKT = `POINT(${location.longitude} ${location.latitude})`;
        availabilityStart = new Date(availabilityStart); // Ensure departureTime is a valid Date object
        const parkingSpot: MyParkingSpot[] = await prisma.$queryRaw`
              INSERT INTO "Listing" (userid, status, availabilitystart, price, region, subregion, location)
              VALUES (${userId}, ${status}::"ListingStatus", ${availabilityStart}, ${price}, ${region}, ${subregion}, ST_GeomFromText(${locationWKT}, 4326))
              RETURNING id, userid, status, availabilityStart, price, region, subregion, location::text as location`;
        parkingSpot[0].price = parseFloat(
          parkingSpot[0].price.toFixed(2)
        ) as unknown as number;
        //parkingSpot[0].cost = parkingSpot[0].cost.toFixed(2);
        return parkingSpot[0];
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
