// src/routes/user.routes.ts

import express from "express";
import * as userController from "../controllers/user.controller"; // Make sure path is correct

const router = express.Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.listUsers);

export default router;
