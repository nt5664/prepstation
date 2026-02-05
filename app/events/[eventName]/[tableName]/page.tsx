import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addMinutes, format, isWithinInterval } from "date-fns";
import { notFound } from "next/navigation";
import DisplayGrid from "@/app/_components/DisplayGrid";
import Semaphore from "@/app/_components/Semaphore";
import { getTableDisplayEntries } from "@/app/_lib/data/table-service";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import { ExtraValue } from "@/app/_types/ExtraValue";
import { getEndDate, numberToDuration } from "@/app/_utils/time";
import { syncExtraData } from "@/app/_utils/table";

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
      {entries.length && (
        <div className="flex justify-between">
          <div className="flex flex-col ml-8">
            <h4>Starts: {format(startDate, "dd MMMM yyyy HH:mm")}</h4>
            <h4>Ends: {format(endDate, "dd MMMM yyyy HH:mm")}</h4>
          </div>

          <Semaphore startDate={startDate} endDate={endDate} />
        </div>
      )}

      <DisplayGrid
        columnDefinition={`24px auto auto repeat(${visibleExtras.length + 1},minmax(0,1fr)) 24px`}
        renderHeader={() =>
          [
            "",
            "Begins",
            "Length",
            "Name",
            ...visibleExtras.map((x) => x.name),
            "",
          ].map((x, i) => (
            <div
              key={`${x}-${i}`}
              className={clsx(
                "px-1 rounded-sm font-bold tracking-wide text-cyan-800",
                x ? " bg-gray-400" : "",
              )}
            >
              {x}
            </div>
          ))
        }
        renderRows={() => {
          const visibleExtraNames = visibleExtras.map((x) => x.name);
          let totalEstimate = 0;
          return entries.map((x, i) => {
            const start = addMinutes(startDate, totalEstimate);
            totalEstimate += x.estimate + transitionTime;
            return (
              <ScheduleRow
                key={Symbol(x.name).toString()}
                active={isWithinInterval(new Date(), {
                  start,
                  end: addMinutes(start, x.estimate),
                })}
                alternation={i % 2}
                data={{
                  ...x,
                  start,
                  extraData: x.extraData.filter((x) =>
                    visibleExtraNames.includes(x.name),
                  ),
                }}
                extraColumns={extraColumns}
              />
            );
          });
        }}
      />
    </div>
  );
}

function ScheduleRow({
  data: { start, estimate, name, extraData },
  extraColumns,
  active,
  alternation = 0,
}: Readonly<{
  data: {
    start: Date;
    estimate: number;
    name: string;
    extraData: ExtraValue[];
  };
  extraColumns: ExtraColumnDefinition[];
  active?: boolean;
  alternation?: number;
}>) {
  const style = clsx(
    "px-1 rounded-sm truncate",
    active ? "text-cyan-400 font-semibold" : "text-cyan-100",
    !alternation ? "bg-gray-800" : "bg-gray-700",
  );

  return (
    <>
      <div>
        {active && (
          <ChevronDoubleRightIcon className="text-cyan-400" height={24} />
        )}
      </div>
      <div
        className={clsx(style, "text-center")}
        title={format(start, "dd MMMM yyyy HH:mm")}
      >
        {format(start, "HH:mm")}
      </div>
      <div className={clsx(style, "text-center")}>
        {numberToDuration(estimate)}
      </div>
      <div className={style} title={name}>
        {name}
      </div>
      {syncExtraData(extraColumns, extraData, (col, val) => (
        <div key={`${start}-${col.name}`} className={style} title={val}>
          {val}
        </div>
      ))}
      <div>
        {active && (
          <ChevronDoubleLeftIcon className="text-cyan-400" height={24} />
        )}
      </div>
    </>
  );
}
