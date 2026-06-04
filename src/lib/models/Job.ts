import mongoose, { Schema, type Model } from "mongoose";

export interface IJob {
  title: string;
  client: string;
  location: string;
  description: string;
  requiredSkills: string[];
  status: string;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    status: { type: String, default: "open" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Job: Model<IJob> =
  (mongoose.models.Job as Model<IJob>) ||
  mongoose.model<IJob>("Job", JobSchema);

export default Job;
