import express from "express";
import * as parkingSpotController from "../controllers/spot.controller"; // Correct the import path

const router = express.Router();

router.post("/", parkingSpotController.createParkingSpot);
router.get("/:id", parkingSpotController.getParkingSpotById);
router.put("/:id", parkingSpotController.updateParkingSpot);
router.delete("/:id", parkingSpotController.deleteParkingSpot);
router.get("/", parkingSpotController.listParkingSpots);

export default router;
