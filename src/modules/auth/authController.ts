import { Request, RequestHandler, Response } from "express";
import {
  createUserService,
  loginUserService,
  getRefreshTokenService,
} from "./authService";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "../user/userInterface";
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "../../interfaces/login";
// signup
export const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await createUserService(userData);
    reponseFormat<IUser>(res, {
      success: true,
      statusCode: 200,
      message: "User created successfully !",
      data: result,
    });
  }
);
// login
export const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await loginUserService(userData);
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
      message: "User logged in successfully !",
      data: others,
    });
  }
);

export const getRefreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await getRefreshTokenService(refreshToken);

    // set refresh token into cookie
    const cookieOptions = {
      secure: true,
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    reponseFormat<IRefreshTokenResponse>(res, {
      statusCode: 200,
      success: true,
      message: "New access token generated successfully !",
      data: result,
    });
  }
);
