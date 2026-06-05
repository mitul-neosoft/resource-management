import mongoose, { Schema, type Model, Types } from "mongoose";
import { UserRole } from "@/constants/roles";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  employeeId?: string;
  managerEmployeeId?: string;
  isRegistered: boolean;
  uploadedFromBench: boolean;
  designation?: string;
  jd?: string;
  rating?: string;
  experience?: string;
  status?: string;
  team?: string;
  location?: string;
  details?: string;
  domestic?: string;
  ldOngoing?: string;
  candidateTaggedOn?: Date;
  skills: string[];
  resignDate?: Date;
  clientContractEndDate?: Date;
  noticePeriodDays: number;
  assignedJobId?: Types.ObjectId | null;
  assignedCourseId?: Types.ObjectId | null;
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
    employeeId: { type: String, trim: true, unique: true, sparse: true },
    managerEmployeeId: { type: String, trim: true },
    isRegistered: { type: Boolean, default: false },
    uploadedFromBench: { type: Boolean, default: false },
    designation: { type: String },
    jd: { type: String },
    rating: { type: String },
    experience: { type: String },
    status: { type: String, default: "Active" },
    team: { type: String },
    location: { type: String },
    details: { type: String },
    domestic: { type: String },
    ldOngoing: { type: String },
    candidateTaggedOn: { type: Date },
    skills: { type: [String], default: [] },
    resignDate: { type: Date },
    clientContractEndDate: { type: Date },
    noticePeriodDays: { type: Number, default: 90 },
    assignedJobId: { type: Schema.Types.ObjectId, ref: "Job", default: null },
    assignedCourseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
