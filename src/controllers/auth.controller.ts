// src/controllers/user.controller.ts

import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service"; // Ensure path is correct

export async function authEmailSigninController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await authService.authEmailSigninService(email, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function authEmailSignupController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, name } = req.body;
    const user = await authService.authEmailSignupService(
      email,
      password,
      name
    );
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
