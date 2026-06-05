const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function normalizeDate(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Bench days = today - clientContractEndDate (live, never stored) */
export function calculateBenchDays(

  clientContractEndDate?: Date | string | null
): number | null {
  if (!clientContractEndDate) return null;
  const end = normalizeDate(clientContractEndDate);
  const today = normalizeDate(new Date());
  const diff = Math.round((today.getTime() - end.getTime()) / MS_PER_DAY);
  return diff > 0 ? diff : 0;
}

/** Notice days left = (resignDate + noticePeriodDays) - today; only when resignDate exists */
export function calculateNoticeDaysLeft(
  resignDate?: Date | string | null,
  noticePeriodDays = 90
): number | null {
  if (!resignDate) return null;
  const resign = normalizeDate(resignDate);
  const noticeEnd = new Date(resign);
  noticeEnd.setDate(noticeEnd.getDate() + noticePeriodDays);
  const today = normalizeDate(new Date());
  const diff = Math.round((noticeEnd.getTime() - today.getTime()) / MS_PER_DAY);
  return diff > 0 ? diff : 0;
}

export function benchSeverity(days: number | null) {
  if (days === null) return "unknown";
  if (days >= 30) return "critical";
  if (days > 7) return "moderate";
  return "fresh";
}
