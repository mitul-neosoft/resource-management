import Match, { type IMatch } from "@/lib/models/Match";
import { Types } from "mongoose";

export const matchRepository = {
  findByJob(jobId: string) {
    return Match.find({ jobId })
      .populate("userId", "-password")
      .sort({ score: -1 })
      .lean();
  },

  findByJobAndUser(jobId: string, userId: string) {
    return Match.findOne({ jobId, userId }).lean();
  },

  countByJob(jobId: string) {
    return Match.countDocuments({ jobId, score: { $gt: 0 } });
  },

  async upsertMatch(data: {
    jobId: string;
    userId: string;
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  }) {
    return Match.findOneAndUpdate(
      {
        jobId: new Types.ObjectId(data.jobId),
        userId: new Types.ObjectId(data.userId),
      },
      {
        score: data.score,
        matchedSkills: data.matchedSkills,
        missingSkills: data.missingSkills,
      },
      { upsert: true, new: true }
    ).lean();
  },

  async deleteByJob(jobId: string) {
    return Match.deleteMany({ jobId });
  },

  findForUser(userId: string) {
    return Match.find({ userId, score: { $gt: 0 } })
      .populate("jobId")
      .sort({ score: -1 })
      .lean();
  },
};
