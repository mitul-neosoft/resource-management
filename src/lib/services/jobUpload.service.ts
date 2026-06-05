import * as XLSX from "xlsx";
import { Types } from "mongoose";
import { jobRepository } from "@/lib/repositories/job.repository";
import { parseJobFromJDDetails } from "@/lib/utils/jdParser";
import { runMatchingForJob } from "@/lib/services/matching.service";
import UploadLog from "@/lib/models/UploadLog";

interface JobRow {
  GroupID?: string;
  Location?: string;
  AddedOn?: string | number;
  "Active Internal Profiles"?: string;
  "JD Details"?: string;
}

function parseExcelDate(value: string | number | undefined): Date | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) return new Date(date.y, date.m - 1, date.d);
  }
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? undefined : d;
}

export async function processJobsUpload(
  buffer: Buffer,
  fileName: string,
  uploadedBy: string
) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<JobRow>(sheet, { defval: "" });

  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  const createdJobIds: string[] = [];

  for (const [index, row] of rows.entries()) {
    try {
      const jdDetails = String(row["JD Details"] || "").trim();
      if (!jdDetails) throw new Error("JD Details is required");

      const location = String(row.Location || "Remote");
      const parsed = parseJobFromJDDetails(jdDetails, location);
      const openings = parseInt(
        String(row["Active Internal Profiles"] || "1").replace(/\D/g, ""),
        10
      ) || 1;

      const job = await jobRepository.create({
        title: parsed.title,
        company: row.GroupID ? `Group ${row.GroupID}` : "Internal",
        location: parsed.location || location,
        description: parsed.jdText,
        skills: parsed.skills,
        experienceRequired: parsed.experience,
        openings,
        status: "open",
        priority: openings > 1 ? "High" : "Medium",
        groupId: String(row.GroupID || ""),
        addedOn: parseExcelDate(row.AddedOn) || new Date(),
        activeInternalProfiles: String(row["Active Internal Profiles"] || ""),
        jdText: parsed.jdText,
        createdBy: new Types.ObjectId(uploadedBy),
      });

      const jobId = String(job._id);
      createdJobIds.push(jobId);
      await runMatchingForJob(jobId);
      success++;
    } catch (err) {
      failed++;
      errors.push(
        `Row ${index + 2}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  await UploadLog.create({
    type: "jobs",
    fileName,
    success,
    failed,
    total: rows.length,
    uploadedBy: new Types.ObjectId(uploadedBy),
  });

  return { success, failed, total: rows.length, errors, createdJobIds };
}
