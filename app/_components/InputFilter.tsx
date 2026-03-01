"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useFilter } from "@/app/_lib/hooks/useFilter";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";

export default function InputFilter({
  header,
  filterKey,
  value,
  maxLength,
}: Readonly<{
  header?: string;
  filterKey: string;
  value?: string;
  maxLength?: number;
}>) {
  const [currValue, setCurrValue] = useState(value ?? "");
  const { filterValue, updateSearchParams } = useFilter({
    filterKey,
    defaultValue: value,
    resetPagination: true,
  });

  function handleSearch() {
    updateSearchParams(currValue);
  }

  function handleReset() {
    updateSearchParams(null);
    setCurrValue("");
  }

  return (
    <div className="flex flex-col">
      {header && <div>{header}</div>}
      <div className="flex gap-2">
        <div className="flex relative w-full">
          <input
            id={filterKey}
            className="px-1 py-px w-full border-2 outline-0 rounded-md border-cyan-700 focus:border-cyan-400"
            maxLength={maxLength}
            value={currValue}
            onChange={(e) => setCurrValue(e.target.value)}
          />
          <Button
            className={twMerge(
              clsx(
                "absolute right-1 top-1.75",
                !currValue.length
                  ? "hidden"
                  : "text-teal-600 hover:text-teal-500 active:text-teal-700",
              ),
            )}
            type={ButtonType.Borderless}
            mode={ButtonMode.Button}
            disabled={!currValue.length}
            onClick={handleReset}
          >
            <XMarkIcon height={20} />
          </Button>
        </div>
        <Button
          type={ButtonType.Primary}
          mode={ButtonMode.Button}
          disabled={!currValue || currValue.length < 3}
          onClick={handleSearch}
        >
          <MagnifyingGlassIcon height={22} />
        </Button>
      </div>
    </div>
  );
}
