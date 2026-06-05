import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import Assessment from "@/lib/models/Assessment";

export const GET = createHandler(
  async ({ auth }) => {
    const filter =
      auth.role === UserRole.USER
        ? { userId: auth.userId }
        : {};
    const assessments = await Assessment.find(filter)
      .populate("userId", "firstName lastName email")
      .sort({ dueDate: -1 })
      .lean();
    return jsonOk({ assessments });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ auth, body }) => {
    const data = body as {
      userId: string;
      title: string;
      status?: string;
      dueDate?: string;
    };
    const assessment = await Assessment.create({
      userId: new Types.ObjectId(data.userId),
      title: data.title,
      status: data.status || "Pending",
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      createdBy: new Types.ObjectId(auth.userId),
    });
    return jsonOk({ message: "Assessment created.", assessment }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
