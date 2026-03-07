import Link from "next/link";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import WarningBox from "@/app/_components/primitives/WarningBox";
import DataRow from "@/app/_components/primitives/DataRow";
import DisplayGrid from "@/app/_components/DisplayGrid";
import UserActivityView from "@/app/_components/moderation/UserActivityView";
import { DataGroup } from "@/app/_components/moderation/DataGroup";

export default async function UserDataView({
  user: {
    createdAt,
    role,
    modNote,
    status,
    events,
    editorOf,
    reports,
    reportsHandled,
    allActivities,
  },
}: Readonly<{
  user: {
    createdAt: Date;
    modNote: string | null;
    reports: {
      createdAt: Date;
      message: string;
      handled: boolean;
      reported: {
        title: string;
        name: string;
      };
    }[];
    role: string;
    status: string;
    events: {
      title: string;
      name: string;
    }[];
    editorOf: {
      title: string;
      name: string;
    }[];
    reportsHandled: {
      createdAt: Date;
      message: string;
      reporter: { name: string; status: string };
      reported: { name: string; title: string };
    }[];
    allActivities: number;
  };
}>) {
  return (
    <div className="flex flex-col my-1 gap-2">
      {status !== "ACTIVE" && modNote && (
        <WarningBox
          className="mx-2 my-1"
          header="User banned"
          message={modNote}
          color="yellow"
        />
      )}
      <div className="grid grid-cols-2 grid-rows-[17rem_17rem] gap-2 px-2">
        <DataGroup header="Stats">
          <div className="flex flex-col">
            <DataRow
              name="Profile created"
              value={format(
                new TZDate(createdAt, "UTC"),
                `dd MMM yyyy HH:mm:ss '(UTC)'`,
              )}
            />
            <DataRow name="Status" value={status} />
            <DataRow name="Role" value={role} />
            <DataRow name="Events created" value={events.length} />
            <DataRow name="Events co-managed" value={editorOf.length} />
            <DataRow name="Reports created" value={reports.length} />
            <DataRow name="Reports handled" value={reportsHandled.length} />
            <DataRow name="Overall activities made" value={allActivities} />
          </div>
        </DataGroup>

        <DataGroup header="Activities">
          <UserActivityView />
        </DataGroup>

        <DataGroup header="Created events">
          <DisplayGrid
            className="max-h-full overflow-auto"
            columnDefinition="1fr 1fr 1fr"
            renderRows={() =>
              events.map((x) => (
                <Link
                  key={x.name}
                  href={`/mod/events/${x.name}`}
                  className="border-2 rounded-md text-center align-middle border-cyan-600 bg-gray-700"
                >
                  {x.title}{" "}
                  <span>
                    <ArrowTopRightOnSquareIcon className="inline" height={20} />
                  </span>
                </Link>
              ))
            }
          />
        </DataGroup>

        <DataGroup header="Events co-managed">
          <DisplayGrid
            className="max-h-full overflow-auto"
            columnDefinition="1fr 1fr 1fr"
            renderRows={() =>
              editorOf.map((x) => (
                <Link
                  key={x.name}
                  href={`/mod/events/${x.name}`}
                  className="border-2 rounded-md text-center align-middle border-cyan-600 bg-gray-700"
                >
                  {x.title}{" "}
                  <span>
                    <ArrowTopRightOnSquareIcon className="inline" height={20} />
                  </span>
                </Link>
              ))
            }
          />
        </DataGroup>
      </div>
    </div>
  );
}
