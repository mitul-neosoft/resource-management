import BenchCandidate, { type IBenchCandidate } from "@/lib/models/BenchCandidate";

export const benchCandidateRepository = {
  findAll(filter: Record<string, unknown> = {}) {
    return BenchCandidate.find(filter).sort({ benchDays: -1 }).lean();
  },

  findById(id: string) {
    return BenchCandidate.findById(id).lean();
  },

  findByEmail(email: string) {
    return BenchCandidate.findOne({ email: email.toLowerCase() }).lean();
  },

  create(data: Partial<IBenchCandidate>) {
    return BenchCandidate.create(data);
  },

  update(id: string, data: Partial<IBenchCandidate>) {
    return BenchCandidate.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  upsertByEmail(email: string, data: Partial<IBenchCandidate>) {
    return BenchCandidate.findOneAndUpdate(
      { email: email.toLowerCase() },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
  },

  delete(id: string) {
    return BenchCandidate.findByIdAndDelete(id);
  },

  count(filter: Record<string, unknown> = {}) {
    return BenchCandidate.countDocuments(filter);
  },
};
