import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import Link from "next/link";
import Image from "next/image";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import WarningBox from "@/app/_components/primitives/WarningBox";
import { DataGroup } from "@/app/_components/moderation/DataGroup";
import DataRow from "@/app/_components/primitives/DataRow";

type EventManagerData = { id: string; name: string; image: string | null };

export default async function EventDataView({
  event: {
    name,
    createdAt,
    updatedAt,
    visibility,
    modNote,
    description,
    creator,
    schedules,
    reports,
    editors,
  },
}: Readonly<{
  event: {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    visibility: string;
    modNote: string | null;
    creator: EventManagerData;
    editors: EventManagerData[];
    schedules: {
      stub: string;
      title: string;
      startDate: Date;
      _count: { entries: number };
    }[];
    reports: {
      id: string;
      createdAt: Date;
      message: string;
      handled: boolean;
      reporter: { id: string; name: string };
      handledBy: { id: string; name: string } | null;
    }[];
  };
}>) {
  const additionalEditors = editors.filter((x) => x.id !== creator.id);

  return (
    <div className="flex flex-col my-1 gap-2">
      {visibility !== "ACTIVE" && modNote && (
        <WarningBox
          className="mx-2 my-1"
          header="Event suspended"
          message={modNote}
          color="yellow"
        />
      )}

      <div className="grid grid-cols-2 gap-2 grid-rows-[auto_1fr] mx-2">
        <DataGroup className="col-1 row-span-full" header="Stats">
          <div className="flex flex-col">
            <DataRow name="Name" value={name} />
            <DataRow
              name="Created"
              value={format(
                new TZDate(createdAt, "UTC"),
                `dd MMM yyyy HH:mm:ss '(UTC)'`,
              )}
            />
            <DataRow
              name="Last updated"
              value={format(
                new TZDate(updatedAt, "UTC"),
                `dd MMM yyyy HH:mm:ss '(UTC)'`,
              )}
            />
            <DataRow name="Visibility" value={visibility} />
            <DataRow name="Description" value={description} />
            <DataRow
              name="Creator"
              value={
                <ManagerCard
                  id={creator.id}
                  name={creator.name}
                  image={creator.image}
                />
              }
            />
            <DataRow
              name="Additional editors"
              value={additionalEditors.length}
            />
            <DataRow name="Tables" value={schedules.length} />
            <DataRow
              name="Overall entries"
              value={schedules.reduce(
                (acc, cur) => acc + cur._count.entries,
                0,
              )}
            />
            <DataRow name="Reports" value={reports.length} />
            <DataRow
              name="Unresolved reports"
              value={reports.reduce(
                (acc, cur) => acc + (cur.handled ? 0 : 1),
                0,
              )}
            />
          </div>
        </DataGroup>

        <DataGroup className="row-1 col-2" header="Editors">
          <div className="grid">
            {additionalEditors.length ? (
              additionalEditors.map((x) => (
                <ManagerCard
                  key={x.id}
                  id={x.id}
                  name={x.name}
                  image={x.image}
                />
              ))
            ) : (
              <div className="col-span-full text-center">
                There are no additional editors
              </div>
            )}
          </div>
        </DataGroup>

        <DataGroup className="row-2 col-2" header="Tables">
          {schedules.map((x) => (
            <TableCard
              key={x.stub}
              eventName={name}
              stub={x.stub}
              title={x.title}
              startDate={x.startDate}
              entries={x._count.entries}
            />
          ))}
        </DataGroup>
      </div>
    </div>
  );
}

function ManagerCard({ id, name, image }: Readonly<EventManagerData>) {
  return (
    <Link
      className="flex gap-1 border-2 rounded-sm my-0.5 px-1 py-px"
      href={`/mod/users/${id}`}
      target="_blank"
    >
      <Image
        className="rounded-full"
        src={image ?? "/imgs/user.png"}
        alt={`Picture of ${name}`}
        width={22}
        height={22}
      />
      <div>{name}</div>
      <ArrowTopRightOnSquareIcon height={22} />
    </Link>
  );
}

function TableCard({
  eventName,
  stub,
  title,
  startDate,
  entries,
}: Readonly<{
  eventName: string;
  stub: string;
  title: string;
  startDate: Date;
  entries: number;
}>) {
  return (
    <Link
      className="flex justify-between gap-1 border-2 rounded-sm font-semibold my-0.5 px-1 py-px text-sky-200"
      href={`/events/${eventName}/${stub}`}
      target="_blank"
    >
      <div className="flex gap-1">
        <div>{title}</div>
        <div className="px-1 rounded-sm bg-sky-200 text-slate-600">
          Entries: {entries}
        </div>
      </div>
      <div className="flex gap-0.5">
        {format(new TZDate(startDate, "UTC"), "dd MMM yyyy HH:mm:ss '(UTC)'")}
        <ArrowTopRightOnSquareIcon className="self-center" height={20} />
      </div>
    </Link>
  );
}
