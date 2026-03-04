"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import { PAGINATION_KEY } from "@/app/_utils/constants";
import { useFilter } from "@/app/_lib/hooks/useFilter";

export default function PageNavigation({
  className,
  lastPage,
  customKey,
}: Readonly<{ className?: string; lastPage: boolean; customKey?: string }>) {
  const { filterValue: pageString, updateSearchParams: updatePage } = useFilter(
    { filterKey: customKey ?? PAGINATION_KEY, defaultValue: null },
  );
  const page = parseInt(pageString ?? "1");

  return (
    <div className={twMerge(clsx("flex gap-2", className))}>
      <Button
        type={ButtonType.Secondary}
        mode={ButtonMode.Button}
        disabled={page < 2}
        onClick={() => updatePage((page <= 2 ? 1 : page - 1).toString())}
      >
        <ChevronLeftIcon height={16} />
      </Button>
      <Button
        type={ButtonType.Secondary}
        mode={ButtonMode.Button}
        disabled={lastPage}
        onClick={() => updatePage((lastPage ? page : page + 1).toString())}
      >
        <ChevronRightIcon height={16} />
      </Button>
    </div>
  );
}
