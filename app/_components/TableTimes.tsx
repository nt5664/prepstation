"use client";

import Semaphore from "@/app/_components/Semaphore";
import { useLocalTimeString } from "@/app/_lib/hooks/useLocalTimeString";
import { useCallback } from "react";

export default function TableTimes({
  startDate,
  endDate,
}: Readonly<{ startDate: Date; endDate: Date }>) {
  const localStart = useLocalTimeString(startDate);
  const localEnd = useLocalTimeString(endDate);

  return (
    <div className="flex justify-between">
      <div className="flex flex-col ml-8">
        <h4>Starts: {localStart}</h4>
        <h4>Ends: {localEnd}</h4>
      </div>

      <Semaphore startDate={startDate} endDate={endDate} />
    </div>
  );
}
