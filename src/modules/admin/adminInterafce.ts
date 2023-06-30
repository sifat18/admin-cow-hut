import { Model } from "mongoose";
import { UserName } from "../user/userInterface";
import { Admin_ROLE } from "./adminConstant";

export type IAdmin = {
  name: UserName;
  role: Admin_ROLE.ADMIN;
  password: string;
  phoneNumber: number;
  address: string;
};
export type AdminModel = Model<IAdmin, Record<string, unknown>>;
