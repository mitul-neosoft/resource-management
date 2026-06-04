import mongoose, { Schema, type Model } from "mongoose";

export interface IDashboardStats {
  employeeId: string;
  benchDays: number;
  noticeDaysLeft: number;
  totalSkills: number;
  learningProgress: number;
  updatedAt: Date;
}

const DashboardStatsSchema = new Schema<IDashboardStats>(
  {
    employeeId: { type: String, required: true, unique: true },
    benchDays: { type: Number, default: 0 },
    noticeDaysLeft: { type: Number, default: 0 },
    totalSkills: { type: Number, default: 0 },
    learningProgress: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const DashboardStats: Model<IDashboardStats> =
  (mongoose.models.DashboardStats as Model<IDashboardStats>) ||
  mongoose.model<IDashboardStats>("DashboardStats", DashboardStatsSchema);

export default DashboardStats;
