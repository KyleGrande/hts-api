import { Request, Response, NextFunction } from "express";
import * as requestService from "../services/request.service"; // Make sure path is correct

export async function createRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId, status, arrivalTime, departureTime, bid, type } = req.body;
    const request = await requestService.createRequest(
      userId,
      status,
      new Date(arrivalTime),
      new Date(departureTime),
      bid,
      type
    );
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
}

export async function getRequestById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const request = await requestService.getRequestById(id);
    if (request) {
      res.json(request);
    } else {
      res.status(404).send("Request not found");
    }
  } catch (error) {
    next(error);
  }
}

export async function updateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { status, arrivalTime, departureTime, bid, type } = req.body;
    const updatedRequest = await requestService.updateRequest(id, {
      status,
      arrivalTime: new Date(arrivalTime),
      departureTime: new Date(departureTime),
      bid,
      type,
    });
    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
}

export async function deleteRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    await requestService.deleteRequest(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listRequests(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requests = await requestService.listRequests();
    res.json(requests);
  } catch (error) {
    next(error);
  }
}
