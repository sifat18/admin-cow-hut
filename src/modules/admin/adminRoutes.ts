import express from "express";
import { createAdmin } from "./adminController";

const router = express.Router();

router.post("/admins/create-admin", createAdmin);

export const adminRoutes = router;
