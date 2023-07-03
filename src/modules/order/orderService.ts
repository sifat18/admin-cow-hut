import mongoose, { Types } from "mongoose";
import { ICow } from "../cow/cowInterface";
import { Cow } from "../cow/cowModel";
import { IUser } from "../user/userInterface";
import { IOrder, IUserInterfaceWithId } from "./orderInterface";
import APIError from "../../errorHelpers/APIError";
import { User } from "../user/userModel";
import { Order } from "./orderModel";
import { JwtPayload } from "jsonwebtoken";

export const createOrderService = async (
  data: IOrder
): Promise<IOrder | null> => {
  const cowInfo = await Cow.findOne({
    _id: new mongoose.Types.ObjectId(data?.cow as Types.ObjectId),
  });
  // cow info check
  if (!cowInfo) {
    throw new APIError(404, "Cow not found");
  }
  if (cowInfo.label === "sold out") {
    throw new APIError(404, "Cow already sold");
  }
  // userInfo check
  const userInfo = await User.findOne({
    _id: new mongoose.Types.ObjectId(data?.buyer as Types.ObjectId),
  });
  if (!userInfo) {
    throw new APIError(404, "User not found");
  }
  if (userInfo.role !== "buyer") {
    throw new APIError(404, "order not possible for this user Role");
  }

  if (userInfo?.budget && cowInfo?.price > userInfo?.budget) {
    throw new APIError(404, "Not enough budget to buy the cow");
  }

  // -----------------transaction------
  let newOrderAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // cow label change
    cowInfo.label = "sold out";
    const updatedCowData: Partial<ICow> = { ...cowInfo };
    const latestCowData = await Cow.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(cowInfo?._id) },
      updatedCowData,
      {
        new: true,
        session,
      }
    ).populate("seller");
    // seller income and data update:
    let income =
      (latestCowData?.seller as IUserInterfaceWithId)?.income + cowInfo.price;

    const latestSellerData = await User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(
          (latestCowData?.seller as IUserInterfaceWithId)?._id
        ),
      },
      { income },
      {
        new: true,
        session,
      }
    );
    // buyer data update
    let budget = userInfo?.budget - cowInfo.price;
    const latestBuyerData = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userInfo?._id) },
      { budget },
      {
        new: true,
        session,
      }
    );
    // order create
    const orderObject = {
      cow: latestCowData?._id,
      buyer: latestBuyerData?._id,
    };
    const newOrder = await Order.create([orderObject], { session });
    if (!newOrder.length) {
      throw new APIError(404, "Failed to create order");
    }
    newOrderAllData = newOrder[0];
    // commiting
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
  if (newOrderAllData) {
    newOrderAllData = await Order.findOne({
      _id: new mongoose.Types.ObjectId(newOrderAllData._id),
    })
      .populate({
        path: "cow",
        populate: { path: "seller", select: "-password" },
      })
      .populate({ path: "buyer", select: "-password" });
  }

  return newOrderAllData;
};
// get alll
export const getAllOrderService = async (
  user: JwtPayload | null
): Promise<IOrder[] | undefined> => {
  let result;
  let userIdAsObjecId = new mongoose.Types.ObjectId(user?._id);
  //  for admin
  if (user?.role === "admin") {
    result = await Order.find({})
      .populate({
        path: "cow",
        populate: { path: "seller", select: "-password" },
      })
      .populate({ path: "buyer", select: "-password" });
  }
  // for buyer
  else if (user?.role === "buyer") {
    const exists = await Order.aggregate([
      { $match: { buyer: userIdAsObjecId } },
      {
        $lookup: {
          from: "cows",
          localField: "cow",
          foreignField: "_id",
          as: "cow",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $addFields: {
          cow: { $arrayElemAt: ["$cow", 0] },
          buyer: { $arrayElemAt: ["$buyer", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "cow.seller",
          foreignField: "_id",
          as: "cow.seller",
        },
      },
      {
        $addFields: {
          "cow.seller": { $arrayElemAt: ["$cow.seller", 0] },
        },
      },
      {
        $project: {
          "buyer.password": 0,
          "cow.seller.password": 0,
        },
      },
    ]);

    result = exists?.length > 0 ? exists : [];
  }
  // for seller
  else if (user?.role === "seller") {
    const orders = await Order.find({})
      .populate({
        path: "cow",
        match: { seller: userIdAsObjecId },
        populate: {
          path: "seller",
          select: "-password",
        },
      })
      .populate({ path: "buyer", select: "-password" });

    result = orders.filter((order) => order.cow !== null);
  }

  return result;
};
// single
export const getSingleOrderService = async (
  id: string,
  user: JwtPayload | null
): Promise<IOrder | null | undefined> => {
  let result;
  let userIdAsObjecId = new mongoose.Types.ObjectId(user?._id);
  //  for admin
  if (user?.role === "admin") {
    result = await Order.findOne({
      _id: new mongoose.Types.ObjectId(id),
    })
      .populate({
        path: "cow",
        populate: { path: "seller", select: "-password" },
      })
      .populate({ path: "buyer", select: "-password" });
  }
  // buyer
  else if (user?.role === "buyer") {
    result = await Order.findOne({
      _id: new mongoose.Types.ObjectId(id),
    })
      .populate({
        path: "cow",
        populate: { path: "seller", select: "-password" },
      })
      .populate({ path: "buyer", select: "-password" });
    const { buyer } = result as IOrder;
    if (!(buyer as Types.ObjectId).equals(userIdAsObjecId)) {
      throw new APIError(403, "Forbidden");
    }
  }
  // seller
  else if (user?.role === "seller") {
    result = await Order.findOne({
      _id: new mongoose.Types.ObjectId(id),
    })
      .populate({
        path: "cow",
        populate: { path: "seller", select: "-password" },
      })
      .populate({ path: "buyer", select: "-password" });
    if (
      (result?.cow as ICow)?.seller &&
      !((result?.cow as ICow)?.seller as Types.ObjectId).equals(userIdAsObjecId)
    ) {
      throw new APIError(403, "Forbidden");
    }
  }
  return result;
};
