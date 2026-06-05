import Course, { type ICourse } from "@/lib/models/Course";
import CourseAssignment, { type ICourseAssignment } from "@/lib/models/CourseAssignment";

export const courseRepository = {
  findAllCourses() {
    return Course.find().sort({ createdAt: -1 }).lean();
  },

  findCourseById(id: string) {
    return Course.findById(id).lean();
  },

  createCourse(data: Partial<ICourse>) {
    return Course.create(data);
  },

  updateCourse(id: string, data: Partial<ICourse>) {
    return Course.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  findAssignments(filter: Record<string, unknown> = {}) {
    return CourseAssignment.find(filter)
      .populate("courseId")
      .populate("userId", "firstName lastName email designation employeeId")
      .sort({ updatedAt: -1 })
      .lean();
  },

  findAssignmentsByUser(userId: string) {
    return CourseAssignment.find({ userId })
      .populate("courseId")
      .sort({ updatedAt: -1 })
      .lean();
  },

  createAssignment(data: Partial<ICourseAssignment>) {
    return CourseAssignment.create(data);
  },

  updateAssignment(id: string, data: Partial<ICourseAssignment>) {
    return CourseAssignment.findByIdAndUpdate(id, data, { new: true })
      .populate("courseId")
      .lean();
  },

  findAssignmentById(id: string) {
    return CourseAssignment.findById(id).populate("courseId").lean();
  },
};
