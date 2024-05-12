import { Request, Response, NextFunction } from "express";
import * as parkingSpotService from "../services/spot.service";

export async function createParkingSpot(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, status, available, departureTime, cost, type, location } =
      req.body;
    const parkingSpot = await parkingSpotService.createParkingSpot(
      userId,
      status,
      available,
      departureTime,
      cost,
      type,
      location
    );
    res.status(201).json(parkingSpot);
  } catch (error) {
    next(error);
  }
}

export async function getParkingSpotById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const parkingSpot = await parkingSpotService.getParkingSpotById(id);
    if (parkingSpot) {
      res.json(parkingSpot);
    } else {
      res.status(404).send("Parking spot not found");
    }
  } catch (error) {
    next(error);
  }
}

export async function updateParkingSpot(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const { status, available, departureTime, cost, type, location } = req.body;
    const updatedParkingSpot = await parkingSpotService.updateParkingSpot(id, {
      status,
      available,
      departureTime,
      cost,
      type,
      location,
    });
    res.json(updatedParkingSpot);
  } catch (error) {
    next(error);
  }
}

export async function deleteParkingSpot(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await parkingSpotService.deleteParkingSpot(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listParkingSpots(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parkingSpots = await parkingSpotService.listParkingSpots();
    res.json(parkingSpots);
  } catch (error) {
    next(error);
  }
}
