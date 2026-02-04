import { notFound } from "next/navigation";
import EventActions from "@/app/_components/EventActions";
import EventCard from "@/app/_components/EventCard";
import { getServerSession } from "@/app/_lib/auth";
import { getEventSummary } from "@/app/_lib/data/event-service";
import { isSuperuser } from "@/app/_utils/user";
import TableCard from "@/app/_components/TableCard";
import { getEarliestDate } from "@/app/_utils/time";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ eventName: string }> }>) {
  const { eventName } = await params;
  const event = await getEventSummary(eventName);

  return {
    title: event?.title,
  };
}

export default async function EventPage({
  params,
}: Readonly<{
  params: Promise<{ eventName: string }>;
}>) {
  const { eventName } = await params;
  const event = await getEventSummary(eventName);
  if (!event) notFound();

  const session = await getServerSession();

  const editorNames = event!.editors.map((x) => x.name);
  const isEditor = !!session && editorNames.includes(session!.user.name);

  return (
    <div className="flex flex-col gap-2.5 w-3/5 mx-auto my-10 p-2 rounded-md border-2 border-cyan-900 bg-gray-700">
      <EventCard
        title={event!.title}
        editors={editorNames}
        timetables={event.schedules.length}
        startDate={getEarliestDate(event.schedules) ?? undefined}
      />

      {session && (
        <div className="px-2 py-1 self-start border-2 rounded-sm border-gray-600">
          <EventActions
            eventId={event!.id}
            eventName={eventName}
            isMod={isSuperuser(session?.user) ?? false}
            isEditor={isEditor}
            isCreator={!!session && event.creator.name === session!.user.name}
          />
        </div>
      )}

      <div className="grid grid-cols-4 p-2 rounded-sm bg-gray-600">
        {event!.schedules.length ? (
          event!.schedules.map((x) => (
            <TableCard
              key={`${eventName}/${x.title}`}
              eventName={eventName}
              isEditor={isEditor}
              table={x}
            />
          ))
        ) : (
          <div className="col-span-full text-center">
            This event doesn&apos;t have any tables...
          </div>
        )}
      </div>
    </div>
  );
}
