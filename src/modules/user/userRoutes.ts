import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "./userController";
import auth from "../../middlewears/auth";
import { Admin_ROLE } from "../admin/adminConstant";

const router = express.Router();

router.get("/users", auth(Admin_ROLE.ADMIN), getAllUser);
router.get("/users/:id", auth(Admin_ROLE.ADMIN), getSingleUser);
router.patch("/users/:id", auth(Admin_ROLE.ADMIN), updateUser);
router.delete("/users/:id", auth(Admin_ROLE.ADMIN), deleteUser);

export const UserRoutes = router;
