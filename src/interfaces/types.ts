import { Prisma } from "@prisma/client";
export interface Config {
  environment: string;
  port: string;
  databaseUrl: string;
}
export interface MyLocation {
  latitude: number;
  longitude: number;
}

export type MyParkingSpot = {
  userId: number;
  status: string;
  available: boolean;
  departureTime: Date;
  cost: number;
  type: string;
  location: MyLocation;
};
