import { Schema, model } from "mongoose";
import { User } from "../user/userModel";
import { IOrder, OrderModel } from "./orderInterface";
import { Cow } from "../cow/cowModel";

export const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: { type: Schema.Types.ObjectId, ref: Cow, required: true },
    buyer: { type: Schema.Types.ObjectId, ref: User, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Order = model<IOrder, OrderModel>("Order", orderSchema);
