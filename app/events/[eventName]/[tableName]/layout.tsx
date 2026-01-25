import Link from "next/link";
import { getEventWithTable } from "@/app/_lib/data/event-service";

export default async function ScheduleLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ eventName: string; tableName: string }>;
  children: React.ReactNode;
}>) {
  const { eventName, tableName } = await params;
  const event = await getEventWithTable(eventName, tableName);

  if (!event || !event!.schedules.length) return null;
  else
    return (
      <div className="grid grid-cols-1 grid-rows-[auto_1fr]">
        <div className="grid grid-rows-[auto_auto] grid-cols-2 w-4/5 mx-auto bg-slate-600">
          <h2 className="row-1 col-1 text-4xl italic tracking-wider">
            {event.schedules.at(0)?.title}
          </h2>
          <div className="row-2 col-1 flex w-9/10 mx-auto">
            <h3 className="text-2xl font-semibold tracking-wide">
              <Link href={`/events/${eventName}`}>{event.title}</Link>
            </h3>
          </div>
        </div>

        {children}
      </div>
    );
}
