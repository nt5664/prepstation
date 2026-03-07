import EventDataView from "@/app/_components/moderation/EventDataView";
import EventModActions from "@/app/_components/moderation/EventModActions";
import BackButton from "@/app/_components/primitives/BackButton";
import { getEventData } from "@/app/_lib/data/event-service";

export default async function EventDataPage({
  params,
}: Readonly<{
  params: Promise<{ eventId: string }>;
}>) {
  const { eventId } = await params;
  const event = await getEventData(eventId);

  return (
    <div className="mx-auto mt-4 w-7/10">
      <h2 className="text-2xl tracking-wider text-center">
        {event ? event!.title : "Event data"}
      </h2>
      <BackButton href="/mod/users" restoreParams />
      <div className="border-2 rounded-lg border-cyan-700 bg-gray-600 text-cyan-100">
        {event ? (
          <div className="flex flex-col gap-1">
            <EventModActions id={eventId} visibility={event.visibility} />
            <EventDataView event={event} />
          </div>
        ) : (
          <div className="my-1 text-center">
            The requested event cannot be found
          </div>
        )}
      </div>
    </div>
  );
}
