"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { PAGINATION_KEY } from "@/app/_utils/constants";
import { useFilter } from "../_lib/hooks/useFilter";

export default function PageNavigation({
  className,
  lastPage,
}: Readonly<{ className?: string; lastPage: boolean }>) {
  const { filterValue: pageString, updateSearchParams: updatePage } = useFilter(
    { filterKey: PAGINATION_KEY, defaultValue: null },
  );
  const page = parseInt(pageString ?? "1");

  /*const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get(PAGINATION_KEY) ?? "1");

  const createQueryString = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PAGINATION_KEY, newPage.toString());
      return params.toString();
    },
    [searchParams],
  );

  function handlePageSwitch(pageNum: number) {
    router.replace(`${pathname}?${createQueryString(pageNum)}`);
  }*/

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
