const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/;

export type DateRange = {
  from: string;
  to: string;
};

export function addDays(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00`);
  parsed.setDate(parsed.getDate() + days);

  return toDateString(parsed);
}

export function defaultWorkWeekDateRange(date = new Date()): DateRange {
  const monday = startOfWorkWeek(toDateString(date));

  return {
    from: `${monday}T00:00:00`,
    to: `${addDays(monday, 5)}T00:00:00`,
  };
}

export function startOfWorkWeek(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  const day = parsed.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  parsed.setDate(parsed.getDate() - daysFromMonday);

  return toDateString(parsed);
}

export function parseDateRange(
  searchParams: URLSearchParams,
): DateRange | { error: string } {
  const from = normalizeRangeValue(searchParams.get("from"));
  const to = normalizeRangeValue(searchParams.get("to"));

  if (!from || !to) {
    return { error: "Both from and to query parameters are required." };
  }

  return validateDateRange({ from, to });
}

export function validateDateRange(range: DateRange): DateRange | { error: string } {
  const fromDate = new Date(range.from);
  const toDate = new Date(range.to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return { error: "Use from and to as YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss." };
  }

  if (toDate <= fromDate) {
    return { error: "The to value must be after from." };
  }

  const days = (toDate.getTime() - fromDate.getTime()) / 86_400_000;

  if (days > 31) {
    return { error: "Date ranges can be at most 31 days." };
  }

  return range;
}

export function normalizeRangeValue(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (dateOnlyPattern.test(trimmed)) {
    return `${trimmed}T00:00:00`;
  }

  if (dateTimePattern.test(trimmed)) {
    return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  }

  return null;
}

export function toDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
