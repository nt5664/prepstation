"use client";

import clsx from "clsx";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import { useFilter } from "@/app/_lib/hooks/useFilter";

export default function Filter({
  header,
  filterKey,
  values,
  defaultValue = null,
}: Readonly<{
  header?: string;
  filterKey: string;
  values: { display: string; value: string }[];
  defaultValue?: string | null;
}>) {
  const { filterValue: value, updateSearchParams } = useFilter({
    filterKey,
    defaultValue,
    resetPagination: true,
  });

  return (
    <div className="flex flex-col">
      {header && <div>{header}</div>}
      <div className="flex border-2 rounded-md border-sky-600">
        {values.map((x) => (
          <Button
            key={x.value}
            className={clsx(
              "m-0 px-1.5 py-1",
              value === x.value
                ? "bg-sky-600 hover:bg-sky-600 active:bg-sky-600"
                : "hover:bg-sky-700 active:bg-sky-800",
            )}
            type={ButtonType.Borderless}
            mode={ButtonMode.Button}
            onClick={() => updateSearchParams(x.value)}
          >
            {x.display}
          </Button>
        ))}
      </div>
    </div>
  );
}
