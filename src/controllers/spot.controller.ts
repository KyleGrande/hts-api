// Assuming the file is named parkingSpotController.ts and functions are exported
import { Request, Response, NextFunction } from "express";
import * as parkingSpotService from "../services/spot.service"; // Correct path if necessary
import { Location } from "../interfaces/types"; // Ensure the Location type is imported correctly

export function createParkingSpot(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { userId, status, available, departureTime, cost, type, location } =
    req.body as {
      userId: number;
      status: string;
      available: boolean;
      departureTime: Date;
      cost: number;
      type: string;
      location: Location;
    };
  parkingSpotService
    .createParkingSpot(
      userId,
      status,
      available,
      departureTime,
      cost,
      type,
      location
    )
    .then((parkingSpot) => res.status(201).json(parkingSpot))
    .catch((error) => next(error));
}

// Implement other functions similarly...

export function getParkingSpotById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = parseInt(req.params.id);
  parkingSpotService
    .getParkingSpotById(id)
    .then((parkingSpot) => {
      if (parkingSpot) {
        res.json(parkingSpot);
      } else {
        res.status(404).send("Parking spot not found");
      }
    })
    .catch((error) => next(error));
}

export function updateParkingSpot(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = parseInt(req.params.id);
  const { status, available, departureTime, cost, type, location } = req.body;
  parkingSpotService
    .updateParkingSpot(id, {
      status,
      available,
      departureTime,
      cost,
      type,
      location,
    })
    .then((updatedParkingSpot) => res.json(updatedParkingSpot))
    .catch((error) => next(error));
}

export function deleteParkingSpot(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = parseInt(req.params.id);
  parkingSpotService
    .deleteParkingSpot(id)
    .then(() => res.status(204).send())
    .catch((error) => next(error));
}

export function listParkingSpots(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  parkingSpotService
    .listParkingSpots()
    .then((parkingSpots) => res.json(parkingSpots))
    .catch((error) => next(error));
}
