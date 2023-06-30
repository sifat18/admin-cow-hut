import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "../user/userInterface";
import { IAdmin } from "./adminInterafce";
import { createAdminService, loginService } from "./adminService";
import config from "../../config";
import { ILoginUserResponse } from "../../interfaces/login";
export const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await createAdminService(adminData);
    // const { password, ...data } = result;
    let dataWithoutPass;
    if (result) {
      const { password, ...rest } = result;
      dataWithoutPass = rest;
    }
    reponseFormat<Partial<IAdmin>>(res, {
      success: true,
      statusCode: 200,
      message: "Admin created successfully !",
      data: dataWithoutPass,
    });
  }
);
export const loginAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await loginService(adminData);
    const { refreshToken, ...others } = result;
    // set refresh token into cookie

    const cookieOptions = {
      secure: true,
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    reponseFormat<ILoginUserResponse>(res, {
      success: true,
      statusCode: 200,
      message: "Admin created successfully !",
      data: others,
    });
  }
);
