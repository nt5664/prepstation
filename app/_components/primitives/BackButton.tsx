"use client";

import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BackButton({
  href,
  restoreParams = false,
}: Readonly<{ href: string; restoreParams?: boolean }>) {
  const searchParams = useSearchParams();

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
