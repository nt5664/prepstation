import Link from "next/link";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { JsonValue } from "@/app/_data/runtime/client";
import WarningBox from "@/app/_components/primitives/WarningBox";
import DataRow from "@/app/_components/primitives/DataRow";
import { getTimeFormatString } from "@/app/_utils/prefs";
import { getPrefTimeFormat } from "@/app/_lib/pref";
import DisplayGrid from "@/app/_components/DisplayGrid";
import Button from "@/app/_components/primitives/Button";

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
    activity,
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
    activity: {
      createdAt: Date;
      affects: string;
      affectedId: string | null;
      payload: JsonValue;
    }[];
    reportsHandled: {
      id: string;
      createdAt: Date;
      message: string;
      handledAt: Date | null;
      reporterId: string;
      reportedId: string;
      handled: boolean;
      handlerId: string | null;
    }[];
  };
}>) {
  const timeFormat = getTimeFormatString(await getPrefTimeFormat());

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
                `dd MMM yyyy ${timeFormat} '(UTC)'`,
              )}
            />
            <DataRow name="Status" value={status} />
            <DataRow name="Role" value={role} />
            <DataRow name="Events created" value={events.length} />
            <DataRow name="Co-manages" value={editorOf.length} />
            <DataRow name="Reports created" value={reports.length} />
            <DataRow name="Reports handled" value={reportsHandled.length} />
            <DataRow name="Overall activities made" value={activity.length} />
          </div>
        </DataGroup>

        <DataGroup header="Activities">
          <DisplayGrid
            className="max-h-full overflow-auto"
            columnDefinition="1fr"
            renderRows={() =>
              activity.map((x) => (
                <Button
                  key={Symbol(x.createdAt.valueOf()).toString()}
                  className="border-2 rounded-md text-center align-middle border-cyan-600 bg-gray-700"
                >
                  <div className="flex justify-between">
                    <div>
                      {format(
                        new TZDate(x.createdAt),
                        "dd MMM yyyy HH:mm:ss '(UTC)'",
                      )}
                    </div>
                    <div>{x.affects}</div>
                  </div>
                </Button>
              ))
            }
          />
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

function DataGroup({
  header,
  children,
}: Readonly<{ header: string; children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-2 h-full p-1 border-2 rounded-md border-cyan-700">
      <div className="border-2 rounded-md text-xl text-center tracking-widest border-cyan-700 bg-slate-700">
        {header}
      </div>

      <div className="min-h-0 flex-1 max-h-full">{children}</div>
    </div>
  );
}
