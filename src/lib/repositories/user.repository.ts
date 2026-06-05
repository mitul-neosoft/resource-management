import User, { type IUser } from "@/lib/models/User";
import { UserRole } from "@/constants/roles";
import {
  calculateBenchDays,
  calculateNoticeDaysLeft,
} from "@/lib/utils/bench";
import { normalizeEmployeeId } from "@/lib/utils/employeeId";

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
    employeeId: user.employeeId,
    managerEmployeeId: user.managerEmployeeId,
    isRegistered: user.isRegistered,
  };
}

export const userRepository = {
  findBenchUsers(filter: Record<string, unknown> = {}) {
    return User.find({
      role: UserRole.USER,
      uploadedFromBench: true,
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

  findBenchUserByEmployeeId(employeeId: string) {
    return User.findOne({
      employeeId: normalizeEmployeeId(employeeId),
      role: UserRole.USER,
    })
      .select("-password")
      .lean();
  },

  findByEmployeeId(employeeId: string) {
    return User.findOne({
      employeeId: normalizeEmployeeId(employeeId),
    })
      .select("-password")
      .lean();
  },

  findEmployeesByManagerEmployeeId(managerEmployeeId: string) {
    return User.find({
      managerEmployeeId: normalizeEmployeeId(managerEmployeeId),
      role: UserRole.USER,
      uploadedFromBench: true,
    })
      .select("-password")
      .sort({ updatedAt: -1 })
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

  async upsertBenchUserByEmployeeId(
    employeeId: string,
    data: Partial<IUser> & { password?: string }
  ) {
    const normalizedId = normalizeEmployeeId(employeeId);
    const existing = await User.findOne({ employeeId: normalizedId });

    if (existing) {
      const { password, email, ...rest } = data;
      Object.assign(existing, rest);
      if (password) existing.password = password;
      if (email && !existing.isRegistered) {
        existing.email = email.toLowerCase().trim();
      }
      existing.employeeId = normalizedId;
      existing.uploadedFromBench = true;
      await existing.save();
      return existing.toObject();
    }

    if (!data.password) {
      throw new Error("Password required for new user");
    }
    if (!data.email) {
      throw new Error("Email required for new user");
    }

    const user = await User.create({
      ...data,
      employeeId: normalizedId,
      email: data.email.toLowerCase().trim(),
      uploadedFromBench: true,
      isRegistered: false,
    });
    return user.toObject();
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

  updateByEmployeeId(employeeId: string, data: Partial<IUser>) {
    return User.findOneAndUpdate(
      { employeeId: normalizeEmployeeId(employeeId) },
      data,
      { new: true }
    )
      .select("-password")
      .lean();
  },

  delete(id: string) {
    return User.findOneAndDelete({ _id: id, role: UserRole.USER });
  },

  countBench(filter: Record<string, unknown> = {}) {
    return User.countDocuments({
      role: UserRole.USER,
      uploadedFromBench: true,
      ...filter,
    });
  },
};
