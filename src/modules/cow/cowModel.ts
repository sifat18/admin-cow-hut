import { Schema, model } from "mongoose";
import { CowModel, ICow } from "./cowInterface";
import { category, labels, location } from "./cowConstant";
import { User } from "../user/userModel";

export const cowSchema = new Schema<ICow, CowModel>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: location,
    },
    category: {
      type: String,
      enum: category,
    },

    label: {
      type: String,
      enum: labels,
      required: true,
    },

    seller: { type: Schema.Types.ObjectId, ref: User },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Cow = model<ICow, CowModel>("Cow", cowSchema);
