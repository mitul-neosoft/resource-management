import mongoose, { Schema, type Model } from "mongoose";
import { UserRole } from "@/constants/roles";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  employeeId?: string;
  designation?: string;
  resignDate?: Date;
  clientContractEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isActive: { type: Boolean, default: true },
    employeeId: { type: String },
    designation: { type: String },
    resignDate: { type: Date },
    clientContractEndDate: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
