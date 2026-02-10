import { addDays, isWithinInterval } from "date-fns";
import { getPrefSemaphoreStyle } from "@/app/_lib/pref";
import { SemaphoreStyle } from "@/app/_types/Prefs";

export default async function Semaphore({
  startDate,
  endDate,
}: Readonly<{ startDate: Date; endDate: Date }>) {
  const style = await getPrefSemaphoreStyle();
  return (
    <div className="flex mr-8 gap-2 items-center">
      <div
        className={getSemaphoreClass(startDate, endDate, style, false)}
      ></div>
      <div className={getSemaphoreClass(startDate, endDate, style, true)}></div>
    </div>
  );
}

function getSemaphoreClass(
  start: Date,
  end: Date,
  style: SemaphoreStyle,
  inverse: boolean,
) {
  const currDate = new Date();
  if (
    style !== "off" &&
    isWithinInterval(currDate, { start: addDays(start, -2), end })
  )
    return style === "animated"
      ? `semaphore${inverse ? "-inverse" : ""}`
      : "semaphore-active";
  else return "semaphore-inactive";
}
