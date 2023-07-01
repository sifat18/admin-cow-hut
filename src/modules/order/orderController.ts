import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IOrder } from "./orderInterface";
import reponseFormat from "../../shared/responseFormat";
import { createOrderService, getAllOrderService } from "./orderService";
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
  let result = await getAllOrderService();
  let userIdAsObjecId = new mongoose.Types.ObjectId(req.user?._id);
  // const exists = await Order.aggregate([
  //   { $match: { buyer: userIdAsObjecId } },
  // ]);

  // // const exists = result?.filter((order) =>
  // //   order.buyer?.equals(userIdAsObjecId)
  // // );
  if (req.user?.role === "admin") {
    result = result;
  } else if (req.user?.role === "buyer") {
    const exists = await Order.aggregate([
      { $match: { buyer: userIdAsObjecId } },
      {
        $lookup: {
          from: "cows",
          localField: "cow",
          foreignField: "_id",
          as: "cowData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyerData",
        },
      },
    ]);

    result = exists?.length > 0 ? exists : [];
  } else if (req.user?.role === "seller") {
    const orders = await Order.find({}).populate({
      path: "cow",
      match: { seller: userIdAsObjecId },
    });

    result = orders.filter((order) => order.cow !== null);
  }

  reponseFormat<IOrder[]>(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully !",
    data: result,
  });
});
