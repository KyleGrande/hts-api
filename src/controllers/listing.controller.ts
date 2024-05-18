// src/controllers/listing.controller.ts

import { Request, Response, NextFunction } from "express";
import * as listingService from "../services/listing.service";

export async function createListingController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, status, starttime, price, region, subregion, location } =
      req.body;
    const parkingSpot = await listingService.createListing(
      userId,
      status,
      starttime,
      price,
      region,
      subregion,
      location
    );
    res.status(201).json(parkingSpot);
  } catch (error) {
    next(error);
  }
}

export async function getListingByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const parkingSpot = await listingService.getListingById(id);
    if (parkingSpot) {
      res.json(parkingSpot);
    } else {
      res.status(404).send("Parking spot not found");
    }
  } catch (error) {
    next(error);
  }
}

export async function updateListingByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const { status, availabilityStart, price, region, subregion, location } =
      req.body;
    const updatedParkingSpot = await listingService.updateListingById(id, {
      status,
      availabilityStart,
      price,
      region,
      subregion,
      location,
    });
    res.json(updatedParkingSpot);
  } catch (error) {
    next(error);
  }
}

export async function deleteListingController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await listingService.deleteListing(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllListingsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parkingSpots = await listingService.getAllListings();
    res.json(parkingSpots);
  } catch (error) {
    next(error);
  }
}
