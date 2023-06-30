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
export type AdminModel = {
  isAdminExist(phoneNumber: number): Promise<IAdmin>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;
// export type AdminModel = Model<IAdmin, Record<string, unknown>>;
