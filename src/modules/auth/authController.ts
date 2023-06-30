import { Request, RequestHandler, Response } from "express";
import { createUserService } from "./authService";
import catchAsync from "../../shared/catchAsync";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "../user/userInterface";
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
