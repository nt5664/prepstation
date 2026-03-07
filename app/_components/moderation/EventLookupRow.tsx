"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import Button, { ButtonType } from "@/app/_components/primitives/Button";

export default function EventLookupRow({
  data: { id, name, title, tables, visibility, editors },
}: Readonly<{
  data: {
    id: string;
    name: string;
    title: string;
    tables: number;
    visibility: string;
    editors: { name: string }[];
  };
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick() {
    router.push(
      `/mod/events/${id}${searchParams.size ? `?${searchParams.toString()}` : ""}`,
    );
  }

  return (
    <Button
      className="grid grid-rows-2 grid-cols-2 gap-x-2 px-2 py-1 w-full border-2 rounded-md text-left border-cyan-500 bg-slate-500 hover:bg-slate-400 active:bg-slate-600"
      type={ButtonType.Borderless}
      onClick={handleClick}
    >
      <div className="row-1 col-1 tracking-wider font-semibold">
        {title}
        <span className="inline-block mx-2 px-1 border-2 rounded-sm text-sm border-cyan-800 bg-sky-600">
          Tables: {tables}
        </span>
        {visibility !== "ACTIVE" && (
          <span
            title="Event is suspended by a moderator"
            className="inline-block content-start"
          >
            <NoSymbolIcon className="inline text-rose-400" height={22} />
          </span>
        )}
      </div>
      <div className="row-2 col-1 tracking-wide italic">{name}</div>
      <div className="row-1 col-2 text-center tracking-wide">Editors:</div>
      <div className="row-2 col-2 text-center italic truncate">
        {editors.map((x) => x.name).join(", ")}
      </div>
    </Button>
  );
}
