import mongoose, { Schema, type Model, Types } from "mongoose";

export interface IMatch {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
  },
  { timestamps: true }
);

MatchSchema.index({ jobId: 1, userId: 1 }, { unique: true });
MatchSchema.index({ jobId: 1, score: -1 });

const Match: Model<IMatch> =
  (mongoose.models.Match as Model<IMatch>) ||
  mongoose.model<IMatch>("Match", MatchSchema);

export default Match;
