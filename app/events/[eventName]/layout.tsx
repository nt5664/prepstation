import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function EventsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    eventName: string | undefined;
    tableName: string | undefined;
  }>;
}>) {
  const { eventName, tableName } = await params;
  return (
    <>
      <header className="border-b bg-gray-300 border-emerald-800 text-emerald-950 h-6">
        <div className="flex justify-baseline">
          <p>
            {eventName && (
              <Link href={`/events/${eventName}`}>{eventName}</Link>
            )}
            {tableName && (
              <>
                <span>
                  <ChevronRightIcon />
                </span>
                <Link href={`/events/${eventName}/${tableName}`}>
                  {tableName}
                </Link>
              </>
            )}
          </p>
        </div>
      </header>
      <section>{children}</section>
    </>
  );
}
