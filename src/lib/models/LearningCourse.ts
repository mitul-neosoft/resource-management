import mongoose, { Schema, type Model } from "mongoose";

export interface ILearningCourse {
  title: string;
  description: string;
  progress: number;
  assignedBy: string;
  dueDate: Date;
  employeeId: string;
  createdAt: Date;
}

const LearningCourseSchema = new Schema<ILearningCourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    assignedBy: { type: String, default: "HR Team" },
    dueDate: { type: Date, required: true },
    employeeId: { type: String, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const LearningCourse: Model<ILearningCourse> =
  (mongoose.models.LearningCourse as Model<ILearningCourse>) ||
  mongoose.model<ILearningCourse>("LearningCourse", LearningCourseSchema);

export default LearningCourse;
