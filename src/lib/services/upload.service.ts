import * as XLSX from "xlsx";
import { benchCandidateRepository } from "@/lib/repositories/benchCandidate.repository";

interface UploadRow {
  name?: string;
  email?: string;
  skills?: string;
  experience?: string | number;
  location?: string;
  benchDays?: number;
  noticePeriodDays?: string | number;
  status?: string;
  role?: string;
}

export async function processCandidatesUpload(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<UploadRow>(sheet);

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    try {
      if (!row.name?.trim() || !row.email?.trim()) {
        throw new Error("name and email required");
      }

      const skills = row.skills
        ? String(row.skills)
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      await benchCandidateRepository.upsertByEmail(row.email, {
        name: String(row.name).trim(),
        email: String(row.email).toLowerCase().trim(),
        role: row.role ? String(row.role) : "Developer",
        skills,
        experience: String(row.experience ?? "0"),
        location: String(row.location ?? "Remote"),
        benchDays: Number(row.benchDays ?? 0),
        noticePeriodDays: Number(row.noticePeriodDays ?? 0),
        status: row.status ? String(row.status) : "Active",
      });

      success++;
    } catch (err) {
      failed++;
      errors.push(
        `Row ${index + 2}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  return { success, failed, total: rows.length, errors };
}
