// src/routes/router.ts

import express from "express";

import userRoutes from "./user.routes";
import transactionRoutes from "./transaction.routes";
import parkingSpotRoutes from "./listing.routes";
import requestRoutes from "./request.routes";

const router = express.Router();

export default router;
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/parkingspots", parkingSpotRoutes);
router.use("/requests", requestRoutes);
