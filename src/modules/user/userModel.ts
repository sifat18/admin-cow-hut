import { Schema, model } from "mongoose";
import { roles } from "./userConstant";
import { IUser, UserModel } from "./userInterface";
import bcrypt from "bcrypt";
import config from "../../config";
export const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    role: {
      type: String,
      enum: roles,
    },

    address: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    budget: { type: Number },
    income: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
// check for duplicate
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>("User", userSchema);
