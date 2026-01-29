import { format } from "date-fns";
import Link from "next/link";

export default function EventGridCard({
  eventName,
  eventTitle,
  startDate,
}: Readonly<{
  eventName: string;
  eventTitle: string;
  startDate: Date | null;
}>) {
  return (
    <Link
      href={`/events/${eventName}`}
      className="px-2 py-1 rounded-sm font-semibold border-2 border-gray-700 bg-gray-600 text-teal-400 hover:text-teal-300"
    >
      <div className="min-w-0 max-w-full text-center">
        <div className="truncate">{eventTitle}</div>
        {startDate && <div>{format(startDate, "dd MMMM yyyy")}</div>}
      </div>
    </Link>
  );
}
