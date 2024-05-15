// src/routes/request.routes.ts

import express from "express";
import * as requestController from "../controllers/request.controller"; // Make sure the path is correct

const router = express.Router();

router.post("/", requestController.createRequestController);
router.get("/:id", requestController.getRequestByIdController);
router.put("/:id", requestController.updateRequestByIdController);
router.delete("/:id", requestController.deleteRequestController);
router.get("/", requestController.getAllRequestsController);

export default router;
