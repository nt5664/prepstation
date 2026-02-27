import clsx from "clsx";
import { addMinutes, isWithinInterval } from "date-fns";
import { notFound } from "next/navigation";
import DisplayGrid from "@/app/_components/DisplayGrid";
import { getTableDisplayEntries } from "@/app/_lib/data/table-service";
import { getEndDate } from "@/app/_utils/time";
import { getTimeFormatString } from "@/app/_utils/prefs";
import { getPrefTimeFormat } from "@/app/_lib/pref";
import { getEventWithTables } from "@/app/_lib/data/event-service";
import ScheduleRow from "@/app/_components/ScheduleRow";
import TableTimes from "@/app/_components/TableTimes";
import ScheduleList from "@/app/_components/ScheduleList";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ eventName: string; tableName: string }> }>) {
  const { eventName, tableName } = await params;
  const [table, event] = await Promise.all([
    getTableDisplayEntries(tableName, eventName),
    getEventWithTables(eventName),
  ]);

  return {
    title: `${table?.title} [${event?.title}]`,
    description: `${table?.title} in ${event?.title} is on PrepStation`,
  };
}

export default async function SchedulePage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ eventName: string; tableName: string }>;
  searchParams: Promise<{ secrets: string[] | string | null | undefined }>;
}>) {
  const { eventName, tableName } = await params;
  const { secrets } = await searchParams;
  const table = await getTableDisplayEntries(tableName, eventName);

  if (!table) return notFound();

  const { startDate, extraColumns, transitionTime, entries } = table;
  const endDate = getEndDate({ startDate, entries, transitionTime });
  const secretValues = secrets
    ? new Set(Array.isArray(secrets) ? secrets : [secrets])
    : new Set();
  const visibleExtras = extraColumns.filter(
    (x) => !x.key || secretValues.has(x.key),
  );

  return (
    <div className="flex flex-col w-4/5 mx-auto gap-4">
      {!entries.length ? (
        <div className="mx-auto text-center">This table is empty</div>
      ) : (
        <>
          <TableTimes startDate={startDate} endDate={endDate} />

          <ScheduleList
            startDate={startDate}
            transitionTime={transitionTime}
            entries={entries}
            extraColumns={visibleExtras}
          />
        </>
      )}
    </div>
  );
}
