import APIError from "../../errorHelpers/APIError";
import { IUser } from "../user/userInterface";
import { User } from "../user/userModel";
import { IAdmin } from "./adminInterafce";
import { Admin } from "./adminModel";

// creating user
export const createAdminService = async (
  user: IAdmin
): Promise<IAdmin | null> => {
  if (user.role !== "admin") {
    throw new APIError(400, "Not applicable for this user Role");
  }
  const createdAdmin = await Admin.create(user);

  if (!createdAdmin) {
    throw new APIError(400, "failed to create Admin");
  }
  return createdAdmin;
};
