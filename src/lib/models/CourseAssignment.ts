import mongoose, { Schema, type Model, Types } from "mongoose";

export interface ICourseAssignment {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  candidateId?: Types.ObjectId;
  progress: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseAssignmentSchema = new Schema<ICourseAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "BenchCandidate" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, default: "In Progress" },
  },
  { timestamps: true }
);

CourseAssignmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseAssignment: Model<ICourseAssignment> =
  (mongoose.models.CourseAssignment as Model<ICourseAssignment>) ||
  mongoose.model<ICourseAssignment>("CourseAssignment", CourseAssignmentSchema);

export default CourseAssignment;
