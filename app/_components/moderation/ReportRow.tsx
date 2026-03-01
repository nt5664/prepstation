"use client";

import { format } from "date-fns";
import clsx from "clsx";
import {
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button, { ButtonMode } from "@/app/_components/primitives/Button";
import { handleReport } from "@/app/_lib/actions";
import Link from "next/link";

export default function ReportRow({
  timeFormat,
  data: {
    id,
    createdAt,
    reporter: { name: reporterName },
    reporterId,
    reported: { name: eventName, title: reportedEvent },
    handled,
    handledAt,
    handledBy,
    message,
  },
}: Readonly<{
  timeFormat: string;
  data: {
    id: string;
    createdAt: Date;
    reporter: { name: string };
    reporterId: string;
    reported: { name: string; title: string };
    handled: boolean;
    handledAt: Date | null;
    handledBy: { name: string } | null;
    message: string;
  };
}>) {
  const router = useRouter();

  function handleClick() {
    toast.promise(handleReport(id), {
      loading: "Loading...",
      success: () => {
        router.refresh();
        return "Report has been resolved successfully";
      },
      error: (err) => `Could not resolve the report: ${err}`,
    });
  }

  return (
    <div className="grid grid-cols-7 grid-rows-[auto_auto] col-span-full px-1 py-2 border-2 rounded-md text-center text-sm border-transparent hover:border-sky-500 hover:bg-slate-500">
      <div>{format(createdAt, `dd. MM. yyyy ${timeFormat}`)}</div>
      <Link
        className="text-cyan-500 hover:text-cyan-400 active:text-cyan-600"
        href={`/mod/users/${reporterId}`}
        target="_blank"
      >
        <div className="flex gap-1 content-center justify-center">
          {reporterName}
          <ArrowTopRightOnSquareIcon className="mt-px inline" height={16} />
        </div>
      </Link>
      <Link
        className="text-cyan-500 hover:text-cyan-400 active:text-cyan-600"
        href={`/mod/events/${eventName}`}
        target="_blank"
      >
        <div className="flex gap-1 content-center justify-center">
          {reportedEvent}
          <ArrowTopRightOnSquareIcon className="mt-px inline" height={16} />
        </div>
      </Link>
      <div
        className={clsx(
          "mx-auto px-2 rounded-full text-gray-800 font-semibold text-xs self-center",
          handled ? "bg-emerald-500" : "bg-rose-500",
        )}
      >
        {handled ? "RESOLVED" : "UNRESOLVED"}
      </div>
      <div>
        {handledAt ? format(handledAt, `dd. MM. yyyy ${timeFormat}`) : "-"}
      </div>
      <div>{handledBy ? handledBy.name : "-"}</div>
      {!handled && (
        <div className="flex col-7 row-span-full items-center justify-center">
          <Button
            className="p-1"
            title="Mark report as resolved"
            mode={ButtonMode.Button}
            onClick={handleClick}
          >
            <ShieldCheckIcon height={18} />
          </Button>
        </div>
      )}
      <div className="row-2 col-span-full ml-7 text-left text-sm truncate">
        <span className="font-semibold">Details: </span>
        <span className="italic">{message}</span>
      </div>
    </div>
  );
}
