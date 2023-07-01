import express from "express";
import { createUser, loginUser, getRefreshToken } from "./authController";

const router = express.Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", loginUser);
router.post("/auth/refresh-token", getRefreshToken);
export const authRoutes = router;
