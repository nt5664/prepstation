"use client";

import { useState } from "react";
import { useFilter } from "@/app/_lib/hooks/useFilter";
import { format } from "date-fns";
import Button, { ButtonMode, ButtonType } from "./primitives/Button";
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function RangeFilter({
  header,
  filterKey,
  defaultValue = null,
}: Readonly<{
  header?: string;
  filterKey: string;
  defaultValue?: string | null;
}>) {
  console.log(defaultValue);
  const [values, setValues] = useState<(string | null)[]>([
    defaultValue,
    defaultValue,
  ]);
  const { updateSearchParams: updateParams } = useFilter({
    filterKey,
    defaultValue: `${values[0]};${values[1]}`,
    resetPagination: true,
  });

  function handleChange(idx: number, val: string) {
    console.log(val);
    setValues((prev) => prev.map((x, i) => (i === idx ? val : x)));
  }

  function applyFilter() {
    updateParams(`${values[0]};${values[1]}`);
  }

  function resetFilter() {
    setValues([defaultValue, defaultValue]);
    updateParams(null);
  }
  console.log(values);
  return (
    <div className="flex flex-col">
      {header && <div>{header}</div>}
      <div className="flex border-2 gap-1 px-1 py-0.5 rounded-md border-sky-600">
        <input
          className="outline-0 border-2 rounded-md border-cyan-700"
          type="date"
          value={values[0] ?? undefined}
          onChange={(e) => handleChange(0, e.target.value)}
        />
        <div>-</div>
        <input
          className="outline-0 border-2 rounded-md border-cyan-700"
          type="date"
          value={values[1] ?? undefined}
          onChange={(e) => handleChange(1, e.target.value)}
        />

        <div className="flex">
          <Button
            className="bg-amber-500 border-amber-700 text-amber-700 hover:bg-amber-400 hover:border-amber-600 active:bg-amber-600 active:border-amber-800"
            type={ButtonType.Primary}
            mode={ButtonMode.Button}
            title="Reset"
            onClick={resetFilter}
          >
            <ArrowPathIcon height={16} />
          </Button>

          <Button
            className="bg-lime-500 border-lime-700 text-lime-700 hover:bg-lime-400 hover:border-lime-600 active:bg-lime-600 active:border-lime-800"
            type={ButtonType.Primary}
            mode={ButtonMode.Button}
            title="Apply"
            onClick={applyFilter}
          >
            <FunnelIcon height={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
