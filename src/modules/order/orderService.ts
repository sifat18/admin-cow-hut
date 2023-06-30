import mongoose, { Types } from "mongoose";
import { ICow } from "../cow/cowInterface";
import { Cow } from "../cow/cowModel";
import { IUser } from "../user/userInterface";
import { IOrder } from "./orderInterface";
import APIError from "../../errorHelpers/APIError";
import { User } from "../user/userModel";
import { Order } from "./orderModel";

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
    let income = latestCowData?.seller?.income + cowInfo.price;

    const latestSellerData = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(latestCowData?.seller?._id) },
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
    }).populate(["cow", "buyer"]);
  }

  return newOrderAllData;
};
// get alll
export const getAllOrderService = async (): Promise<IOrder[] | null> => {
  const result = await Order.find({}).populate(["cow", "buyer"]);

  return result;
};
