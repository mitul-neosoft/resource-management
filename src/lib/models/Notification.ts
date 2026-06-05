import mongoose, { Schema, type Model, Types } from "mongoose";

export interface INotification {
  userId?: Types.ObjectId;
  candidateId?: Types.ObjectId;
  courseAssignmentId?: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    candidateId: { type: Schema.Types.ObjectId, ref: "User" },
    courseAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "CourseAssignment",
    },
    type: { type: String, default: "nudge" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification: Model<INotification> =
  (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
