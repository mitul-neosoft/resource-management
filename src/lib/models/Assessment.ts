import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IAssessment {
  userId: Types.ObjectId;
  title: string;
  status: string;
  score?: number;
  dueDate?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    status: { type: String, default: "Pending" },
    score: { type: Number },
    dueDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Assessment: Model<IAssessment> =
  (mongoose.models.Assessment as Model<IAssessment>) ||
  mongoose.model<IAssessment>("Assessment", AssessmentSchema);

export default Assessment;
