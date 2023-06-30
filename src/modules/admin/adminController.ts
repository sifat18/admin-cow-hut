import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "../user/userInterface";
import { IAdmin } from "./adminInterafce";
import { createAdminService } from "./adminService";
export const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await createAdminService(adminData);
    reponseFormat<IAdmin>(res, {
      success: true,
      statusCode: 200,
      message: "Admin created successfully !",
      data: result,
    });
  }
);
