// src/routes/match.routes.ts

import express from "express";
import * as matchController from "../controllers/match.controller"; // Make sure path is correct

const router = express.Router();

router.get("/", matchController.getAllMatchesController); // For testing
router.get("/:id", matchController.getMatchByIdController);
router.delete("/:id", matchController.deleteMatchByIdController);

export default router;
