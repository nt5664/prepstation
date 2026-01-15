import EventActions from "@/app/_components/EventActions";
import EventCard from "@/app/_components/EventCard";
import { getServerSession } from "@/app/_lib/auth";
import { getEventSummary } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ eventName: string }> }>) {
  const { eventName } = await params;
  const event = await getEventSummary(eventName);

  return {
    title: event?.title,
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ eventName: string }>;
}>) {
  const { eventName } = await params;
  const event = await getEventSummary(eventName);
  if (!event) notFound();

  const session = await getServerSession(); // CHANGE HISTORY TABLE, MODERATION BUTTONS. line separator between button groups?

  return (
    <div className="flex flex-col gap-2.5 w-3/5 mx-auto my-10 p-2 rounded-md border-2 border-cyan-900 bg-gray-700">
      <EventCard
        title={event!.title}
        editors={event!.editors.map((x) => x.name)}
      />

      <div className="px-2 py-1 self-start border-2 rounded-sm border-gray-600">
        <EventActions />
      </div>

      <div className="grid p-2 rounded-sm bg-gray-600">
        {event!.schedules.length ? (
          event!.schedules.map((x) => (
            <div key={`${eventName}/${x.title}`}>{x.title}</div>
          ))
        ) : (
          <div className="text-center">
            This event doesn&apos;t have any timetables...
          </div>
        )}
      </div>
    </div>
  );
}
