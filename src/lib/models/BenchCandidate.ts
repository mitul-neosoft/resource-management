import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IBenchCandidate {
  name: string;
  email: string;
  role?: string;
  skills: string[];
  experience: string;
  location: string;
  benchDays: number;
  noticePeriodDays: number;
  status: string;
  availability?: string;
  assignedJobId?: Types.ObjectId | null;
  assignedCourseId?: Types.ObjectId | null;
  userId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const BenchCandidateSchema = new Schema<IBenchCandidate>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String },
    skills: { type: [String], default: [] },
    experience: { type: String, required: true },
    location: { type: String, required: true },
    benchDays: { type: Number, default: 0 },
    noticePeriodDays: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
    availability: { type: String, default: "Immediate" },
    assignedJobId: { type: Schema.Types.ObjectId, ref: "Job", default: null },
    assignedCourseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const BenchCandidate: Model<IBenchCandidate> =
  (mongoose.models.BenchCandidate as Model<IBenchCandidate>) ||
  mongoose.model<IBenchCandidate>("BenchCandidate", BenchCandidateSchema);

export default BenchCandidate;
