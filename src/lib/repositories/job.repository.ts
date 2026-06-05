import Job, { type IJob } from "@/lib/models/Job";
import { Types } from "mongoose";

export const jobRepository = {
  findAll(filter: Record<string, unknown> = {}) {
    return Job.find(filter).sort({ createdAt: -1 }).lean();
  },

  findById(id: string) {
    return Job.findById(id).lean();
  },

  create(data: Partial<IJob>) {
    return Job.create(data);
  },

  update(id: string, data: Partial<IJob>) {
    return Job.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  delete(id: string) {
    return Job.findByIdAndDelete(id);
  },

  close(id: string) {
    return Job.findByIdAndUpdate(id, { status: "closed" }, { new: true }).lean();
  },

  setMatched(id: string, userId: string) {
    return Job.findByIdAndUpdate(
      id,
      { matchedUserId: new Types.ObjectId(userId) },
      { new: true }
    ).lean();
  },
};
