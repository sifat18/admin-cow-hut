import express from "express";
import { createOrder, getAllOrders, singleOrder } from "./orderController";
import auth from "../../middlewears/auth";
import { Admin_ROLE } from "../admin/adminConstant";

const router = express.Router();

router.post("/orders", auth("buyer"), createOrder);
router.get("/orders", auth("seller", "buyer", Admin_ROLE.ADMIN), getAllOrders);
router.get(
  "/orders/:id",
  auth("seller", "buyer", Admin_ROLE.ADMIN),
  singleOrder
);
export const orderRoutes = router;
