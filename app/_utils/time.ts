import { addMinutes } from "date-fns";

export function numberToDuration(value: number) {
  const hours = Math.trunc(value / 60);
  const mins = value - hours * 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getEndDate({
  startDate,
  entries,
  transitionTime,
}: {
  startDate: Date;
  entries: { estimate: number }[];
  transitionTime: number;
}) {
  if (!entries || !entries.length) return startDate;

  return addMinutes(
    startDate,
    entries.reduce((acc, cur) => acc + cur.estimate, 0) +
      (entries.length - 1) * transitionTime,
  );
}

export function getEarliestDate(dates: Date[] | { startDate: Date }[]) {
  if (!dates.length) return null;

  return dates
    .map((x) => (x instanceof Date ? x : x.startDate))
    .sort((a, b) => a.valueOf() - b.valueOf())
    .at(0)!;
}
