// src/controllers/request.controller.ts

import { Request, Response, NextFunction } from "express";
import * as requestService from "../services/request.service"; // Make sure path is correct

export async function createRequestController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      userid,
      status,
      type,
      starttime,
      departureTime,
      relist,
      location,
      bid,
    } = req.body;
    const request = await requestService.createRequest(
      userid,
      status,
      type,
      new Date(starttime),
      new Date(departureTime),
      relist,
      location,
      bid
    );
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
}

export async function getRequestByIdController(
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

export async function updateRequestByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { status, arrivalTime, departureTime, bid, type } = req.body;
    const updatedRequest = await requestService.updateRequestById(id, {
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

export async function deleteRequestController(
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

export async function getAllRequestsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const requests = await requestService.getAllRequest();
    res.json(requests);
  } catch (error) {
    next(error);
  }
}
