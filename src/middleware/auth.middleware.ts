// src/middleware/auth.ts

import { Request, Response, NextFunction } from "express";
import * as auth from "../utils/auth.util";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.bearer || req.headers.Bearer;
    if (!bearer) {
      return res.status(403).json({
        success: false,
        message: "Failure: Invalid token",
        data: null,
      });
    }

    auth.verifyJWT(bearer);

    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Failure: Invalid token",
      data: null,
    });
  }
};
