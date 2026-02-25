import {
  FolderPlusIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Separator from "@/app/_components/primitives/Separator";
import { deleteEvent } from "@/app/_lib/actions";
import ConfirmationButton from "@/app/_components/ConfirmationButton";
import EventReportButton from "@/app/_components/EventReportButton";

export default async function EventActions({
  eventId,
  eventName,
  isMod,
  isEditor,
  isCreator,
}: Readonly<{
  eventId: string;
  eventName: string;
  isMod: boolean;
  isEditor: boolean;
  isCreator: boolean;
}>) {
  return (
    <div className="flex gap-4">
      {!isMod && <EventReportButton eventId={eventId} />}

      {isMod && (
        <Link
          href={`/mod/events/${eventName}`}
          title="Moderate this event"
          className="text-pink-500 hover:text-pink-400"
        >
          <ShieldExclamationIcon height={24} />
        </Link>
      )}

      {isEditor && <Separator width={2} height={24} />}

      {(isEditor || isMod) && (
        <div className="flex gap-1.5">
          <Link
            href={`/editor/${eventName}`}
            title="Add table"
            className="bg-transparent hover:bg-transparent active:bg-transparent text-teal-500 hover:text-teal-400 active:text-teal-600"
          >
            <FolderPlusIcon height={24} />
          </Link>
          <Link
            href={`/editor/event?ename=${eventName}`}
            title="Edit event details"
            className="bg-transparent hover:bg-transparent active:bg-transparent text-teal-500 hover:text-teal-400 active:text-teal-600"
          >
            <PencilSquareIcon height={24} />
          </Link>

          {isCreator && (
            <ConfirmationButton
              title="Delete event"
              action={{ type: "arg", fn: deleteEvent, arg: eventId }}
              successHandling={{ action: "redirect", to: "/user/events" }}
              messages={{
                question: (
                  <span>
                    Are you sure you want to delete this event?{" "}
                    <strong>(this action cannot be undone!)</strong>
                  </span>
                ),
                pending: "Deleting event...",
                success: "Event has been deleted successfully",
                error: "Could not delete the event",
              }}
              buttonLabels={{ yes: "Delete", no: "Cancel" }}
            >
              <TrashIcon height={24} />
            </ConfirmationButton>
          )}
        </div>
      )}
    </div>
  );
}
