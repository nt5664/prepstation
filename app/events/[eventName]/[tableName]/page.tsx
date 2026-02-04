import DisplayGrid from "@/app/_components/DisplayGrid";
import { getTableDisplayEntries } from "@/app/_lib/data/table-service";
import { ExtraValue } from "@/app/_types/ExtraValue";
import { getEndDate, numberToDuration } from "@/app/_utils/time";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addDays, addMinutes, format, isWithinInterval } from "date-fns";
import { notFound } from "next/navigation";

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

          <div className="flex mr-8 gap-2 items-center">
            <div className={getSemaphoreClass(startDate, endDate, false)}></div>
            <div className={getSemaphoreClass(startDate, endDate, true)}></div>
          </div>
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
                "px-1 rounded-sm font-bold tracking-wide text-green-300",
                x ? " bg-gray-500" : "",
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
  active,
  alternation = 0,
}: Readonly<{
  data: {
    start: Date;
    estimate: number;
    name: string;
    extraData: ExtraValue[];
  };
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
      {extraData.map((x) => (
        <div key={`${start}-${x.name}`} className={style} title={x.value}>
          {x.value}
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

function getSemaphoreClass(start: Date, end: Date, inverse: boolean) {
  const currDate = new Date();
  if (isWithinInterval(currDate, { start, end }))
    return `semaphore${inverse ? "-inverse" : ""}`;
  else if (
    isWithinInterval(currDate, { start: addDays(start, -3), end: start })
  )
    return "semaphore-active";
  else return "semaphore-inactive";
}
