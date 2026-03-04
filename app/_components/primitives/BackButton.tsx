"use client";

import { PAGINATION_KEY } from "@/app/_utils/constants";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BackButton({
  href,
  restoreParams = false,
  ignoreParams = [],
}: Readonly<{
  href: string;
  restoreParams?: boolean;
  ignoreParams?: string[];
}>) {
  const searchParams = new URLSearchParams(useSearchParams());
  ignoreParams?.forEach((x) => searchParams.delete(x));

  return (
    <Link
      className="text-teal-500 hover:text-teal-400"
      href={`${href}${restoreParams && searchParams.size ? `?${searchParams.toString()}` : ""}`}
    >
      <span>
        <ArrowLongLeftIcon className="inline" height={24} />
      </span>{" "}
      Go back
    </Link>
  );
}
