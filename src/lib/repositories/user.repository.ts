import User, { type IUser } from "@/lib/models/User";
import { UserRole } from "@/constants/roles";
import {
  calculateBenchDays,
  calculateNoticeDaysLeft,
} from "@/lib/utils/bench";

export function enrichBenchUser(user: IUser & { _id?: unknown }) {
  const benchDays = calculateBenchDays(user.clientContractEndDate);
  const noticeDaysLeft = calculateNoticeDaysLeft(
    user.resignDate,
    user.noticePeriodDays ?? 90
  );
  return {
    ...user,
    _id: String(user._id),
    name: `${user.firstName} ${user.lastName}`,
    benchDays,
    noticeDaysLeft,
    role: user.designation || user.jd,
  };
}

export const userRepository = {
  findBenchUsers(filter: Record<string, unknown> = {}) {
    return User.find({
      role: UserRole.USER,
      ...filter,
    })
      .select("-password")
      .sort({ updatedAt: -1 })
      .lean();
  },

  findBenchUserById(id: string) {
    return User.findOne({ _id: id, role: UserRole.USER })
      .select("-password")
      .lean();
  },

  async findBenchUsersEnriched(filter: Record<string, unknown> = {}) {
    const users = await this.findBenchUsers(filter);
    return users.map((u) => enrichBenchUser(u as IUser));
  },

  findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() }).lean();
  },

  findById(id: string) {
    return User.findById(id).select("-password").lean();
  },

  async upsertBenchUser(email: string, data: Partial<IUser> & { password?: string }) {
    const normalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalized });

    if (existing) {
      const { password, ...rest } = data;
      Object.assign(existing, rest);
      if (password) existing.password = password;
      await existing.save();
      return existing.toObject();
    }

    if (!data.password) {
      throw new Error("Password required for new user");
    }

    const user = await User.create({ ...data, email: normalized });
    return user.toObject();
  },

  update(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, { new: true })
      .select("-password")
      .lean();
  },

  delete(id: string) {
    return User.findOneAndDelete({ _id: id, role: UserRole.USER });
  },

  countBench(filter: Record<string, unknown> = {}) {
    return User.countDocuments({ role: UserRole.USER, ...filter });
  },
};
