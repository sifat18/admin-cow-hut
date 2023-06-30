import { Schema, model } from "mongoose";
import { AdminModel, IAdmin } from "./adminInterafce";
import { Admin_ROLE } from "./adminConstant";

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
  const isExist = await Admin.findOne({
    phoneNumber: this.phoneNumber,
  });
  if (isExist) {
    next();
  }
});

export const Admin = model<IAdmin, AdminModel>("Admin", adminSchema);
