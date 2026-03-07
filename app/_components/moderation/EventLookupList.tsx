import { getEventsBySearchString } from "@/app/_lib/data/event-service";
import EventLookupRow from "@/app/_components/moderation/EventLookupRow";

export default async function EventLookupList({
  search,
}: Readonly<{ search: string | null }>) {
  if (!search || search.length < 1)
    return <div className="text-center">Enter a name to search</div>;

  const foundEvents = await getEventsBySearchString(search);
  return (
    <div className="flex flex-col gap-2 items-center text-gray-100">
      {foundEvents.map((x) => (
        <EventLookupRow key={x.id} data={x} />
      ))}
    </div>
  );
}
