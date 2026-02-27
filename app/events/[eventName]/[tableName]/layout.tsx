import Link from "next/link";
import { getEventWithTable } from "@/app/_lib/data/event-service";
import TwitchIcon from "@/app/_components/primitives/TwitchIcon";
import { EyeSlashIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";
import Loader from "@/app/_components/Loader";

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
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] text-cyan-50">
        <div className="grid grid-cols-[1fr_auto] my-4 p-2 border-2 rounded-md w-4/5 mx-auto border-cyan-800 bg-gray-700">
          <div>
            <div className="flex gap-2">
              <h2 className="text-3xl italic tracking-wider">
                {event.schedules[0].title}
              </h2>
              {event.schedules[0].unlisted && (
                <EyeSlashIcon
                  className="self-center text-teal-600"
                  title="Hidden schedule"
                  height={22}
                />
              )}
            </div>
            <h3 className="ml-8 text-2xl font-semibold tracking-wide text-teal-600 hover:text-teal-500 active:text-teal-700">
              <Link href={`/events/${eventName}`}>{event.title}</Link>
            </h3>
          </div>
          <div className="flex flex-col col-2 gap-1 row-span-full justify-center text-center">
            {event.schedules[0].channel && (
              <Link
                target="_blank"
                href={`https://twitch.tv/${event.schedules[0].channel}`}
                className="px-2 py-px border-2 rounded-md font-semibold text-fuchsia-900 border-fuchsia-900 bg-fuchsia-200 hover:bg-fuchsia-100 active:bg-fuchsia-300"
              >
                <TwitchIcon
                  className="inline-block mr-1 stroke-fuchsia-900 fill-fuchsia-900"
                  height={22}
                />
                {event.schedules[0].channel}
              </Link>
            )}

            {event.schedules[0].website && (
              <Link
                target="_blank"
                href={event.schedules[0].website}
                className="px-2 py-px border-2 rounded-md font-semibold text-green-900 border-green-900 bg-green-200 hover:bg-green-100 active:bg-green-300"
              >
                <GlobeAltIcon className="inline-block mr-1" height={22} />
                Website
              </Link>
            )}
          </div>
        </div>

        <Suspense fallback={<Loader />}>{children}</Suspense>
      </div>
    );
}
