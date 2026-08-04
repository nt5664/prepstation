"use client";

import clsx from "clsx";
import { addMinutes, isWithinInterval } from "date-fns";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import { ExtraValue } from "@/app/_types/ExtraValue";
import DisplayGrid from "@/app/_components/DisplayGrid";
import ScheduleRow from "@/app/_components/ScheduleRow";
import { getTimeFormatString } from "@/app/_utils/prefs";
import { getPreferredTimeFormat } from "@/app/_lib/pref-client";

export default function ScheduleList({
  startDate,
  transitionTime,
  entries,
  extraColumns,
}: Readonly<{
  startDate: Date;
  transitionTime: number;
  entries: { name: string; estimate: number; extraData: ExtraValue[] }[];
  extraColumns: ExtraColumnDefinition[];
}>) {
  const timeFormat = getTimeFormatString(getPreferredTimeFormat());
  return (
    <div className="w-full overflow-x-auto">
      <DisplayGrid
        className="min-w-max sm:min-w-0"
        columnDefinition={`24px auto auto repeat(${extraColumns.length + 1},minmax(0,1fr)) 24px`}
        renderHeader={() =>
          [
            "",
            "Begins",
            "Length",
            "Name",
            ...extraColumns.map((x) => x.name),
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
          const visibleExtraNames = extraColumns.map((x) => x.name);
          let totalEstimate = 0;
          return entries.map((x, i) => {
            const start = addMinutes(startDate, totalEstimate);
            totalEstimate += x.estimate + transitionTime;
            return (
              <ScheduleRow
                key={Symbol(x.name).toString()}
                timeFormat={timeFormat}
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
