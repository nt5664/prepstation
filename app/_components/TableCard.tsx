import { format } from "date-fns";
import Link from "next/link";
import { getEndDate } from "../_utils/time";
import ConfirmationButton from "./ConfirmationButton";
import { deleteTable } from "../_lib/actions";
import {
  ArchiveBoxXMarkIcon,
  NumberedListIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function TableCard({
  eventName,
  isEditor,
  table: { id, stub, title: displayTitle, startDate, entries, transitionTime },
}: Readonly<{
  eventName: string;
  isEditor: boolean;
  table: {
    id: string;
    stub: string;
    title: string;
    startDate: Date;
    entries: { estimate: number }[];
    transitionTime: number;
  };
}>) {
  return (
    <div className="flex flex-col px-2 py-1 border-2 rounded-md border-teal-700 bg-gray-700 hover:border-teal-500">
      <Link
        href={`/events/${eventName}/${stub}`}
        className="mb-1 truncate font-semibold italic tracking-wide hover:text-teal-400"
      >
        {displayTitle}
      </Link>
      <div className="px-2 self-start rounded-sm bg-gray-400 text-gray-700 font-semibold text-sm">
        Entries: {entries.length}
      </div>
      <div className="text-sm">Begins: {format(startDate, "dd MMMM yyyy")}</div>
      <div className="text-sm">
        Ends:{" "}
        {format(
          getEndDate({ startDate, entries, transitionTime }),
          "dd MMMM yyyy",
        )}
      </div>
      {isEditor && (
        <div className="flex mt-1 gap-2 justify-end">
          <Link
            className="text-teal-500 hover:text-teal-400"
            title="Edit table"
            href={`/editor/${eventName}?sname=${stub}`}
          >
            <PencilIcon height={20} />
          </Link>
          <Link
            className="text-teal-500 hover:text-teal-400"
            title="Edit entries"
            href={`/editor/${eventName}/${stub}`}
          >
            <NumberedListIcon height={20} />
          </Link>
          <ConfirmationButton
            action={{
              type: "no-arg",
              fn: async () => {
                "use server";
                await deleteTable(id, eventName);
              },
            }}
            successHandling={{ action: "refresh" }}
            title="Delete table"
            messages={{
              question: (
                <span>
                  Are you sure you want to delete this table?{" "}
                  <strong>(this action cannot be undone!)</strong>
                </span>
              ),
              pending: "Deleting table...",
              success: "Table has been deleted successfully",
              error: "Could not delete the table",
            }}
            buttonLabels={{ yes: "Delete", no: "Cancel" }}
          >
            <ArchiveBoxXMarkIcon height={20} />
          </ConfirmationButton>
        </div>
      )}
    </div>
  );
}
