// src/controllers/match.controller.ts

import { Request, Response, NextFunction } from "express";
import * as matchService from "../services/match.service";

export async function getAllMatchesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const matches = await matchService.getAllMatchesService();
    res.json(matches);
  } catch (error) {
    next(error);
  }
};

export async function getMatchByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const match = await matchService.getMatchByIdService(id);
    if (match) {
      res.json(match);
    } else {
      res.status(404).send('Match not found');
    }
  } catch (error) {
    next(error);
  }
};