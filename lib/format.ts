import type { AvailabilityDay } from "@/lib/rooms";

export function formatRangeLabel(days: AvailabilityDay[]) {
  return `${formatDay(days[0].date)} – ${formatDay(days[days.length - 1].date)}`;
}

export function formatWeekday(day: string) {
  return new Intl.DateTimeFormat("sv-SE", { weekday: "short" })
    .format(new Date(`${day}T12:00:00`))
    .replace(".", "");
}

export function formatDay(day: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
  })
    .format(new Date(`${day}T12:00:00`))
    .replace(".", "");
}

export function formatTime(dateTime: string) {
  return dateTime.slice(11, 16);
}

export function getWeekNumber(day: string) {
  const date = new Date(`${day}T12:00:00`);
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNumber = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3);

  return (
    1 + Math.round((target.getTime() - firstThursday.getTime()) / 604_800_000)
  );
}
