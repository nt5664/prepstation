import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function EventCard({
  title,
  editors,
  startDate,
  timetables = 0,
}: Readonly<{
  title: string;
  editors: string[];
  startDate?: Date;
  timetables?: number;
}>) {
  const year = startDate?.getFullYear() ?? 2026;
  const month = format(startDate ?? new Date(), "LLLL");
  const day = startDate?.getDay() ?? 12;

  return (
    <div className="grid grid-cols-[8fr_1fr_1fr] grid-rows-2 h-20 pl-2 pr-1 py-1 rounded-sm bg-gray-600">
      <h2
        className="tracking-wider leading-none self-end text-3xl whitespace-nowrap overflow-hidden text-ellipsis font-bold italic text-gray-50"
        title={title}
      >
        {title}
      </h2>
      <div className="row-2 col-1 ml-1 self-baseline align-center space-x-2">
        <span className="tracking-wider leading-none text-sm uppercase text-gray-200">
          by
        </span>
        <span className="leading-none text-lg italic text-emerald-400">
          {editors.join(", ")}
        </span>
      </div>

      {startDate && (
        <div className="col-2 row-span-full mx-0.5 grid place-items-center">
          <div className="h-block-full w-inline-full min-w-20 rounded-xl bg-gray-700 relative">
            <div className="absolute inset-0">
              <ClockIcon className="h-full mx-auto stroke-gray-600" />
            </div>
            <div className="relative z-10 flex flex-col gap-1 h-full w-full justify-center items-center">
              <span className="leading-none text-gray-100 text-2xl font-bold">
                {day}
              </span>
              <span className="leading-none text-gray-100 text-sm font-bold text-center uppercase">
                {month}
              </span>
              <span className="leading-none text-gray-100">{year}</span>
            </div>
          </div>
        </div>
      )}
      <div className="col-3 row-span-full ml-0.5 grid place-items-center">
        <div className="h-block-full w-inline-full min-w-20 h-full rounded-xl bg-gray-700 relative">
          <div className="absolute inset-0">
            <CalendarDaysIcon className="h-full mx-auto stroke-gray-600" />
          </div>
          <div className="relative z-10 flex flex-col h-full w-full items-center justify-center">
            <span className="leading-none text-white text-3xl font-bold">
              {timetables}
            </span>
            <span className="leading-none text-white text-lg uppercase">
              TABLES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
