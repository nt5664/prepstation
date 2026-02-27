"use client";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ExtraValue } from "@/app/_types/ExtraValue";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import { numberToDuration } from "@/app/_utils/time";
import { syncExtraData } from "@/app/_utils/table";
import { useLocalTimeString } from "@/app/_lib/hooks/useLocalTimeString";
import { format } from "date-fns";
import { useCallback } from "react";

export default function ScheduleRow({
  data: { start, estimate, name, extraData },
  extraColumns,
  timeFormat,
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
  timeFormat: string;
  active?: boolean;
  alternation?: number;
}>) {
  const formatFn = useCallback(
    (d: Date) => ({
      startDate: format(d, `dd MMMM yyyy ${timeFormat}`),
      startTime: format(d, timeFormat),
    }),
    [timeFormat],
  );

  const { startDate, startTime } = useLocalTimeString(start, formatFn);

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
      <div className={clsx(style, "text-center")} title={startDate}>
        {startTime}
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
