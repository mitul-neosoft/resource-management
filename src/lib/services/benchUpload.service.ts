import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { userRepository } from "@/lib/repositories/user.repository";
import { parseSkillsFromJD } from "@/lib/utils/skillsParser";
import { UserRole } from "@/constants/roles";
import UploadLog from "@/lib/models/UploadLog";
import {
  getEmployeeIdFromRow,
  getManagerEmployeeIdFromRow,
  isValidEmployeeId,
  normalizeEmployeeId,
} from "@/lib/utils/employeeId";

interface BenchRow {
  Name?: string;
  "Employee ID"?: string | number;
  "Manager Employee ID"?: string | number;
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

function validateUniqueEmployeeIds(rows: BenchRow[]) {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const [index, row] of rows.entries()) {
    const employeeId = getEmployeeIdFromRow(row);
    if (!employeeId) {
      throw new Error(`Row ${index + 2}: Employee ID is required`);
    }
    if (!isValidEmployeeId(employeeId)) {
      throw new Error(`Row ${index + 2}: Invalid Employee ID "${employeeId}"`);
    }
    if (seen.has(employeeId)) {
      duplicates.push(employeeId);
    }
    seen.add(employeeId);
  }

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate Employee IDs in file: ${[...new Set(duplicates)].join(", ")}`
    );
  }
}

export async function processBenchUpload(
  buffer: Buffer,
  fileName: string,
  uploadedBy: string
) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellFormula: false, cellNF: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<BenchRow>(sheet, { defval: "" });

  if (rows.length === 0) {
    throw new Error("Excel file is empty");
  }

  validateUniqueEmployeeIds(rows);

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    try {
      const name = String(row.Name || "").trim();
      if (!name) throw new Error("Name is required");

      const employeeId = getEmployeeIdFromRow(row);
      if (!employeeId) throw new Error("Employee ID is required");
      if (!isValidEmployeeId(employeeId)) {
        throw new Error(`Invalid Employee ID "${employeeId}"`);
      }

      const managerEmployeeId = getManagerEmployeeIdFromRow(row);
      const { firstName, lastName } = splitName(name);
      const jd = String(row.JD || "").trim();
      const skills = parseSkillsFromJD(jd);
      const email = emailFromName(name, row.Email);
      const taggedOn = parseExcelDate(row["Candidate Tagged On"]);
      const resignDate = parseResignDate(row["Resigned On?"]);

      let contractEndDate = parseExcelDate(row["Contract End Date"]);
      if (!contractEndDate) {
        const benchDays = Number(row["Bench Days"] || row["Bench Age"] || 0);
        if (benchDays > 0) {
          contractEndDate = new Date();
          contractEndDate.setDate(contractEndDate.getDate() - benchDays);
          contractEndDate.setHours(0, 0, 0, 0);
        }
      }

      const existing = await userRepository.findByEmployeeId(employeeId);
      const placeholderPassword = await bcrypt.hash(`BENCH-${randomUUID()}`, 10);

      await userRepository.upsertBenchUserByEmployeeId(employeeId, {
        firstName,
        lastName,
        email: existing?.isRegistered ? existing.email : email,
        password: existing ? undefined! : placeholderPassword,
        role: UserRole.USER,
        isActive: true,
        isRegistered: existing?.isRegistered ?? false,
        managerEmployeeId: managerEmployeeId
          ? normalizeEmployeeId(managerEmployeeId)
          : undefined,
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

export const BENCH_TEMPLATE_COLUMNS = [
  "Employee ID",
  "Manager Employee ID",
  "Name",
  "Email",
  "JD",
  "Rating",
  "Experience",
  "Status",
  "Team",
  "Location",
  "Details",
  "Bench Days",
  "Contract End Date",
  "Resigned On?",
  "Domestic",
  "L&D Ongoing",
  "Candidate Tagged On",
];

export function generateBenchTemplateBuffer(): Buffer {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([
    BENCH_TEMPLATE_COLUMNS,
    [
      "EMP001",
      "MGR001",
      "John Doe",
      "john.doe@company.com",
      "MERN Developer",
      "A",
      "5 years",
      "Active",
      "Engineering",
      "Remote",
      "",
      15,
      "",
      "No",
      "Yes",
      "No",
      "",
    ],
  ]);
  XLSX.utils.book_append_sheet(workbook, sheet, "Bench");
  return Buffer.from(
    XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
  );
}
