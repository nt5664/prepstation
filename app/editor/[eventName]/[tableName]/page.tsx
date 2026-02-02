import { notFound } from "next/navigation";
import ScheduleEditorForm from "@/app/_components/ScheduleEditorForm";
import { getServerSession } from "@/app/_lib/auth";
import { getEventData } from "@/app/_lib/data/event-service";
import { getTableEntries } from "@/app/_lib/data/table-service";

export const metadata = {
  title: "Schedule editor",
};

export default async function ScheduleEditorPage({
  params,
}: Readonly<{ params: Promise<{ eventName: string; tableName: string }> }>) {
  const { eventName, tableName: stub } = await params;

  const [session, event] = await Promise.all([
    getServerSession(),
    getEventData(eventName),
  ]);

  if (!event || !event.editors.map((x) => x.id).includes(session!.user.id))
    return notFound();

  const table = await getTableEntries(stub, event.id);
  if (!table) return notFound();

  return (
    <div>
      <h2 className="text-center tracking-wider mt-6 mb-4 text-2xl font-medium">
        Edit the schedule of <strong>{table.title}</strong> in{" "}
        <strong>{event.title}</strong>
      </h2>
      <div className="flex flex-col w-3/5 gap-3 justify-self-center">
        <ScheduleEditorForm table={table} eventId={event!.id} />
      </div>
    </div>
  );
}
