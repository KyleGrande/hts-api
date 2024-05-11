import express from "express";
import * as requestController from "../controllers/request.controller"; // Make sure the path is correct

const router = express.Router();

router.post("/", requestController.createRequest);
router.get("/:id", requestController.getRequestById);
router.put("/:id", requestController.updateRequest);
router.delete("/:id", requestController.deleteRequest);
router.get("/", requestController.listRequests);

export default router;
