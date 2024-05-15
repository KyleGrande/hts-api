// src/routes/listing.route.ts

import express from "express";
import * as listingController from "../controllers/listing.controller";

const router = express.Router();

router.post("/", listingController.createListingController);
router.get("/:id", listingController.getListingByIdController);
router.put("/:id", listingController.updateListingByIdController);
router.delete("/:id", listingController.deleteListingController);
router.get("/", listingController.getAllListingsController);

export default router;
