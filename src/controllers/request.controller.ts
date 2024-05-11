import { Request, Response, NextFunction } from "express";
import * as requestService from "../services/request.service"; // Make sure path is correct

export function createRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { userId, status, arrivalTime, departureTime, bid, type } = req.body;
  requestService
    .createRequest(
      userId,
      status,
      new Date(arrivalTime),
      new Date(departureTime),
      bid,
      type
    )
    .then((request) => res.status(201).json(request))
    .catch(next);
}

export function getRequestById(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  requestService
    .getRequestById(id)
    .then((request) => {
      if (request) {
        res.json(request);
      } else {
        res.status(404).send("Request not found");
      }
    })
    .catch(next);
}

export function updateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  const { status, arrivalTime, departureTime, bid, type } = req.body;
  requestService
    .updateRequest(id, {
      status,
      arrivalTime: new Date(arrivalTime),
      departureTime: new Date(departureTime),
      bid,
      type,
    })
    .then((request) => res.json(request))
    .catch(next);
}

export function deleteRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  requestService
    .deleteRequest(id)
    .then(() => res.status(204).send())
    .catch(next);
}

export function listRequests(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  requestService
    .listRequests()
    .then((requests) => res.json(requests))
    .catch(next);
}
