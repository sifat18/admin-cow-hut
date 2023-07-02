import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import {
  deleteUserService,
  getAllUserService,
  getSingleUserService,
  updateUserService,
} from "./userService";
import reponseFormat from "../../shared/responseFormat";
import { IUser } from "./userInterface";

// all user
export const getAllUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllUserService();

    reponseFormat<IUser[]>(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  }
);
// single user
export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await getSingleUserService(id);

  reponseFormat<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// single user profile
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await getSingleUserService(req?.user?._id);

  reponseFormat<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User's information retrieved successfully",
    data: result,
  });
});
// update profile
export const updateUserProfile = catchAsync(
  async (req: Request, res: Response) => {
    // const { id } = req.params;
    const updatedData = req.body;

    const result = await updateUserService(req?.user?._id, updatedData);

    reponseFormat<IUser>(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  }
);
// update
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await updateUserService(id, updatedData);

  reponseFormat<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});
// delete
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteUserService(id);

  reponseFormat<IUser>(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
