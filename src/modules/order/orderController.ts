import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IOrder } from "./orderInterface";
import reponseFormat from "../../shared/responseFormat";
import {
  createOrderService,
  getAllOrderService,
  getSingleOrderService,
} from "./orderService";
import mongoose from "mongoose";
import APIError from "../../errorHelpers/APIError";
import { Order } from "./orderModel";

export const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createOrderService(req.body);
    reponseFormat<IOrder>(res, {
      statusCode: 200,
      success: true,
      message: "Order created successfully",
      data: result,
    });
  }
);
// get all
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllOrderService(req.user);

  reponseFormat<IOrder[]>(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully !",
    data: result,
  });
});
// get 1
export const singleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let result;
  result = await getSingleOrderService(id, req.user);

  reponseFormat<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: "Order information retrieved successfully",
    data: result,
  });
});
