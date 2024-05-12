import { PrismaClient, ParkingSpot, Prisma } from "@prisma/client";
import { MyLocation, MyParkingSpot } from "../interfaces/types"; // Ensure the Location type is imported correctly
const prisma = new PrismaClient().$extends({
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

export default prisma;

export async function createParkingSpot(
  userId: number,
  status: string,
  available: boolean,
  departureTime: Date,
  cost: number,
  type: string,
  location: MyLocation
): Promise<MyParkingSpot> {
  const parkingSpot = await prisma.parkingSpot.create(
    userId,
    status,
    available,
    departureTime,
    cost,
    type,
    location
  );
  return parkingSpot;
}

//const prisma = new PrismaClient();

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

export async function getParkingSpotById(
  id: number
): Promise<ParkingSpot | null> {
  const parkingSpot = await prisma.parkingSpot.findUnique({
    where: { id },
  });
  return parkingSpot;
}

export async function updateParkingSpot(
  id: number,
  data: {
    status?: string;
    available?: boolean;
    departureTime?: Date;
    cost?: number;
    type?: string;
    location?: MyLocation;
  }
): Promise<ParkingSpot> {
  const updatedParkingSpot = await prisma.parkingSpot.update({
    where: { id },
    data,
  });
  return updatedParkingSpot;
}

export async function deleteParkingSpot(id: number): Promise<ParkingSpot> {
  const deletedParkingSpot = await prisma.parkingSpot.delete({
    where: { id },
  });
  return deletedParkingSpot;
}

export async function listParkingSpots(): Promise<ParkingSpot[]> {
  const parkingSpots = await prisma.parkingSpot.findMany();
  return parkingSpots;
}
