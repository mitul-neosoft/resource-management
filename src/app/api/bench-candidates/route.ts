import { UserRole } from "@/constants/roles";
import { createHandler, jsonOk } from "@/lib/api/handler";
import { benchCandidateSchema } from "@/lib/validations/schemas";
import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";

export const GET = createHandler(
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const filter = searchParams.get("filter");

    let candidates = await benchCandidateRepository.findAll();

    if (search) {
      candidates = candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          (c.role || "").toLowerCase().includes(search) ||
          c.skills.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (filter === "critical") {
      candidates = candidates.filter((c) => c.benchDays >= 30);
    } else if (filter === "moderate") {
      candidates = candidates.filter((c) => c.benchDays > 7 && c.benchDays < 30);
    } else if (filter === "fresh") {
      candidates = candidates.filter((c) => c.benchDays <= 7);
    }

    const sort = searchParams.get("sort");
    if (sort === "benchDays") {
      candidates.sort((a, b) => b.benchDays - a.benchDays);
    }

    return jsonOk({ candidates });
  },
  { roles: [UserRole.RESOURCE_MANAGER] }
);

export const POST = createHandler(
  async ({ body }) => {
    const data = body as ReturnType<typeof benchCandidateSchema.parse>;
    const candidate = await benchCandidateRepository.create({
      ...data,
      email: data.email.toLowerCase(),
      experience: String(data.experience),
    });
    return jsonOk({ message: "Candidate created.", candidate }, 201);
  },
  { roles: [UserRole.RESOURCE_MANAGER], schema: benchCandidateSchema }
);
