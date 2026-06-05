import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IJob {
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  experienceRequired: string;
  openings: number;
  status: "open" | "closed";
  priority?: string;
  duration?: string;
  type?: string;
  createdBy: Types.ObjectId;
  matchedCandidateId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    experienceRequired: { type: String, required: true },
    openings: { type: Number, default: 1 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    priority: { type: String, default: "Medium" },
    duration: { type: String },
    type: { type: String, default: "Full-time" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    matchedCandidateId: { type: Schema.Types.ObjectId, ref: "BenchCandidate" },
  },
  { timestamps: true }
);

const Job: Model<IJob> =
  (mongoose.models.Job as Model<IJob>) ||
  mongoose.model<IJob>("Job", JobSchema);

export default Job;
