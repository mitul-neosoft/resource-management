import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { userRepository } from "@/lib/repositories/user.repository";

export const GET = createHandler(
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");

    let candidates = await userRepository.findBenchUsersEnriched();

    if (search) {
      candidates = candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          (c.designation || "").toLowerCase().includes(search) ||
          (c.skills || []).some((s) => s.toLowerCase().includes(search))
      );
    }

    if (filter === "critical") {
      candidates = candidates.filter((c) => (c.benchDays ?? 0) >= 30);
    } else if (filter === "moderate") {
      candidates = candidates.filter(
        (c) => (c.benchDays ?? 0) > 7 && (c.benchDays ?? 0) < 30
      );
    } else if (filter === "fresh") {
      candidates = candidates.filter((c) => (c.benchDays ?? 0) <= 7);
    }

    if (sort === "benchDays") {
      candidates.sort((a, b) => (b.benchDays ?? 0) - (a.benchDays ?? 0));
    }

    return jsonOk({ candidates });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);
