// src/routes/signup.routes.ts

import express from "express";
import * as loginController from "../controllers/auth.controller";

const router = express.Router();

router.post("/signin", loginController.authEmailSigninController);
router.post("/signup", loginController.authEmailSignupController);

export default router;
