"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { PAGINATION_KEY } from "@/app/_utils/constants";

export function useFilter({
  filterKey,
  defaultValue = null,
  resetPagination,
}: {
  filterKey: string;
  defaultValue?: string | null;
  resetPagination?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const filterValue = searchParams.get(filterKey) ?? defaultValue;

  const updateSearchParams = useCallback(
    (val: string | null) => {
      console.log(filterKey, val);
      const params = new URLSearchParams(searchParamsString);
      if (val) params.set(filterKey, val);
      else params.delete(filterKey);

      if (resetPagination) params.set(PAGINATION_KEY, "1");

      const paramsString = params.toString();
      router.replace(`${pathname}?${paramsString}`);
      return paramsString;
    },
    [router, pathname, searchParamsString, filterKey, resetPagination],
  );

  return { filterValue, updateSearchParams };
}
