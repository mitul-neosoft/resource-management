import { Types } from "mongoose";
import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import Interview from "@/lib/models/Interview";

export const GET = createHandler(
  async ({ auth }) => {
    const filter =
      auth.role === UserRole.USER
        ? { userId: auth.userId }
        : {};
    const interviews = await Interview.find(filter)
      .populate("userId", "firstName lastName email")
      .sort({ scheduledAt: -1 })
      .lean();
    return jsonOk({ interviews });
  },
  { roles: [UserRole.USER, UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ auth, body }) => {
    const data = body as {
      userId: string;
      title: string;
      status?: string;
      scheduledAt?: string;
      interviewer?: string;
    };
    const interview = await Interview.create({
      userId: new Types.ObjectId(data.userId),
      title: data.title,
      status: data.status || "Scheduled",
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      interviewer: data.interviewer,
      createdBy: new Types.ObjectId(auth.userId),
    });
    return jsonOk({ message: "Interview scheduled.", interview }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
