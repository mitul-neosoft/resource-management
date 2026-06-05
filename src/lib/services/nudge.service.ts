import { Types } from "mongoose";
import Notification from "@/lib/models/Notification";
import { courseRepository } from "@/lib/repositories/course.repository";
import User from "@/lib/models/User";

export async function sendNudge(params: {
  userId?: string;
  candidateId?: string;
  courseAssignmentId?: string;
  message?: string;
  createdBy: string;
}) {
  let userId = params.userId;
  let title = "Learning Reminder";
  let message =
    params.message ||
    "Please complete your assigned learning course at the earliest.";

  if (params.courseAssignmentId) {
    const assignment = await courseRepository.findAssignmentById(
      params.courseAssignmentId
    );
    if (assignment) {
      userId = String(assignment.userId);
      const course = assignment.courseId as { title?: string };
      title = "Course Nudge";
      message =
        params.message ||
        `Reminder: Please continue "${course?.title || "your course"}". Current progress: ${assignment.progress}%.`;
    }
  }

  if (!userId && params.candidateId) {
    const user = await User.findOne({}).limit(1);
    userId = user ? String(user._id) : undefined;
  }

  const notification = await Notification.create({
    userId: userId ? new Types.ObjectId(userId) : undefined,
    candidateId: params.candidateId
      ? new Types.ObjectId(params.candidateId)
      : undefined,
    courseAssignmentId: params.courseAssignmentId
      ? new Types.ObjectId(params.courseAssignmentId)
      : undefined,
    type: "nudge",
    title,
    message,
    createdBy: new Types.ObjectId(params.createdBy),
  });

  return notification;
}
