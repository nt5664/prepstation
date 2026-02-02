import { getServerSession } from "@/app/_lib/auth";
import {
  getEditedEventsOfUser,
  getEventsOfUser,
} from "@/app/_lib/data/event-service";
import { getEarliestDate } from "@/app/_utils/time";
import DisplayGrid from "@/app/_components/DisplayGrid";
import EventGridCard from "@/app/_components/EventGridCard";

export default async function ManagedEvents() {
  const session = await getServerSession();

  const createdBy = await getEventsOfUser(session!.user.id);
  const editorOf = await getEditedEventsOfUser(session!.user.id);

  return (
    <div className="grid grid-cols-2 gap-2 mx-2 px-2 pb-1.5 pt-0.5 border-2 rounded-md border-cyan-900 bg-gray-600">
      <div className="grid grid-rows-[auto_1fr]">
        <h6
          className="text-md italic font-semibold"
          title="Events that I have created"
        >
          Events created:
        </h6>
        <DisplayGrid
          className="p-1 gap-1 rounded-md border-2 border-cyan-700 bg-gray-500"
          columnDefinition="repeat(3,minmax(0,1fr))"
          renderRows={() =>
            !createdBy.length ? (
              <div className="col-span-full text-center">
                No events to show...
              </div>
            ) : (
              createdBy.map((x) => (
                <EventGridCard
                  key={x.name}
                  eventName={x.name}
                  eventTitle={x.title}
                  startDate={getEarliestDate(x.schedules)}
                />
              ))
            )
          }
        />
      </div>

      <div className="grid grid-rows-[auto_1fr]">
        <h6
          className="text-md italic font-semibold"
          title="Events that I am an editor of"
        >
          Events edited:
        </h6>
        <DisplayGrid
          className="p-1 gap-1 rounded-md border-2 border-cyan-700 bg-gray-500"
          columnDefinition="repeat(3,minmax(0,1fr))"
          renderRows={() =>
            !editorOf.length ? (
              <div className="col-span-full text-center my-auto">
                No events to show...
              </div>
            ) : (
              editorOf.map((x) => (
                <EventGridCard
                  key={x.name}
                  eventName={x.name}
                  eventTitle={x.title}
                  startDate={getEarliestDate(x.schedules)}
                />
              ))
            )
          }
        />
      </div>
    </div>
  );
}
