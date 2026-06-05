import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { userRepository } from "@/lib/repositories/user.repository";
import { parseSkillsFromJD } from "@/lib/utils/skillsParser";
import { UserRole } from "@/constants/roles";
import UploadLog from "@/lib/models/UploadLog";

interface BenchRow {
  Name?: string;
  JD?: string;
  Rating?: string;
  Experience?: string;
  Status?: string;
  Team?: string;
  Location?: string;
  Details?: string;
  "Bench Age"?: string | number;
  "Bench Days"?: string | number;
  "Contract End Date"?: string | number;
  "Resigned On?"?: string;
  Domestic?: string;
  "L&D Ongoing"?: string;
  "Candidate Tagged On"?: string | number;
  Email?: string;
}

function parseExcelDate(value: string | number | undefined): Date | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  
  // Skip Excel formula strings (e.g., "dateDiff(now())", "=TODAY()-90")
  const stringValue = String(value).trim();
  if (stringValue.startsWith("=") || stringValue.includes("(")) {
    return undefined;
  }
  
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) return new Date(date.y, date.m - 1, date.d);
  }
  
  const d = new Date(stringValue);
  return isNaN(d.getTime()) ? undefined : d;
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  return {
    firstName: parts[0] || "Unknown",
    lastName: parts.slice(1).join(" ") || "User",
  };
}

function emailFromName(name: string, existing?: string) {
  if (existing?.includes("@")) return existing.toLowerCase().trim();
  return `${name.toLowerCase().replace(/\s+/g, ".")}@company.bench`;
}

function parseResignDate(value?: string): Date | undefined {
  if (!value?.trim()) return undefined;
  const v = value.toLowerCase();
  if (v === "no" || v === "n" || v === "false" || v === "-") return undefined;
  return parseExcelDate(value);
}

export async function processBenchUpload(
  buffer: Buffer,
  fileName: string,
  uploadedBy: string
) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellFormula: false, cellNF: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<BenchRow>(sheet, { defval: "" });

  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  const defaultPassword = await bcrypt.hash("Bench@123", 10);

  for (const [index, row] of rows.entries()) {
    try {
      const name = String(row.Name || "").trim();
      if (!name) throw new Error("Name is required");

      const { firstName, lastName } = splitName(name);
      const jd = String(row.JD || "").trim();
      const skills = parseSkillsFromJD(jd);
      const email = emailFromName(name, row.Email);
      const taggedOn = parseExcelDate(row["Candidate Tagged On"]);
      const resignDate = parseResignDate(row["Resigned On?"]);
      
      // Get contract end date or calculate from bench days
      let contractEndDate = parseExcelDate(row["Contract End Date"]);
      if (!contractEndDate) {
        const benchDays = Number(row["Bench Days"] || row["Bench Age"] || 0);
        if (benchDays > 0) {
          contractEndDate = new Date();
          contractEndDate.setDate(contractEndDate.getDate() - benchDays);
          contractEndDate.setHours(0, 0, 0, 0);
        }
      }

      const existing = await userRepository.findByEmail(email);

      await userRepository.upsertBenchUser(email, {
        firstName,
        lastName,
        password: existing ? undefined! : defaultPassword,
        role: UserRole.USER,
        isActive: true,
        employeeId: existing?.employeeId || `EMP-${Date.now().toString().slice(-6)}`,
        designation: jd,
        jd,
        rating: String(row.Rating || ""),
        experience: String(row.Experience || ""),
        status: String(row.Status || "Active"),
        team: String(row.Team || ""),
        location: String(row.Location || "Remote"),
        details: String(row.Details || ""),
        domestic: String(row.Domestic || ""),
        ldOngoing: String(row["L&D Ongoing"] || ""),
        candidateTaggedOn: taggedOn,
        clientContractEndDate: contractEndDate,
        skills,
        resignDate,
        noticePeriodDays: 90,
      } as never);

      success++;
    } catch (err) {
      failed++;
      errors.push(
        `Row ${index + 2}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  await UploadLog.create({
    type: "bench",
    fileName,
    success,
    failed,
    total: rows.length,
    uploadedBy: new Types.ObjectId(uploadedBy),
  });

  return { success, failed, total: rows.length, errors };
}
