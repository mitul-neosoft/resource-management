import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IJobApplication {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  status: string;
  createdAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    status: { type: String, default: "applied" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const JobApplication: Model<IJobApplication> =
  (mongoose.models.JobApplication as Model<IJobApplication>) ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);

export default JobApplication;
