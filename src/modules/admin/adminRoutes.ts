import express from "express";
import { createAdmin, loginAdmin } from "./adminController";

const router = express.Router();

router.post("/admins/create-admin", createAdmin);
router.post("/admins/login", loginAdmin);

export const adminRoutes = router;
