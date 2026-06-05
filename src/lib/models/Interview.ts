import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IInterview {
  userId: Types.ObjectId;
  title: string;
  status: string;
  scheduledAt?: Date;
  feedback?: string;
  interviewer?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    status: { type: String, default: "Scheduled" },
    scheduledAt: { type: Date },
    feedback: { type: String },
    interviewer: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Interview: Model<IInterview> =
  (mongoose.models.Interview as Model<IInterview>) ||
  mongoose.model<IInterview>("Interview", InterviewSchema);

export default Interview;
