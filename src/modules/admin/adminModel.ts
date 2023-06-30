import { Schema, model } from "mongoose";
import { AdminModel, IAdmin } from "./adminInterafce";
import { Admin_ROLE } from "./adminConstant";
import config from "../../config";
import bcrypt from "bcrypt";

export const adminSchema = new Schema<IAdmin, AdminModel>(
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
      enum: ["admin"],
    },

    address: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
// check for duplicate
adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>("Admin", adminSchema);
