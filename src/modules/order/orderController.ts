import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IOrder } from "./orderInterface";
import reponseFormat from "../../shared/responseFormat";
import { createOrderService, getAllOrderService } from "./orderService";

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
  const result = await getAllOrderService();

  reponseFormat<IOrder[]>(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully !",
    data: result,
  });
});
