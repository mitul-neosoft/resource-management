export function normalizeEmployeeId(value: string | number | undefined): string {
  return String(value ?? "").trim();
}

export function isValidEmployeeId(value: string): boolean {
  const id = normalizeEmployeeId(value);
  return id.length >= 1 && id.length <= 50;
}

export function getEmployeeIdFromRow(
  row: Record<string, unknown>
): string | undefined {
  const raw =
    row["Employee ID"] ??
    row["EmployeeID"] ??
    row["Employee Id"] ??
    row["employeeId"];
  const id = normalizeEmployeeId(raw as string | number | undefined);
  return id || undefined;
}

export function getManagerEmployeeIdFromRow(
  row: Record<string, unknown>
): string | undefined {
  const raw =
    row["Manager Employee ID"] ??
    row["ManagerEmployeeID"] ??
    row["Manager Employee Id"] ??
    row["managerEmployeeId"];
  const id = normalizeEmployeeId(raw as string | number | undefined);
  return id || undefined;
}
