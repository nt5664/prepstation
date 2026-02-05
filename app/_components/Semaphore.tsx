import { addDays, isWithinInterval } from "date-fns";

export default function Semaphore({
  startDate,
  endDate,
}: Readonly<{ startDate: Date; endDate: Date }>) {
  return (
    <div className="flex mr-8 gap-2 items-center">
      <div className={getSemaphoreClass(startDate, endDate, false)}></div>
      <div className={getSemaphoreClass(startDate, endDate, true)}></div>
    </div>
  );
}

function getSemaphoreClass(start: Date, end: Date, inverse: boolean) {
  const currDate = new Date();
  if (isWithinInterval(currDate, { start, end }))
    return `semaphore${inverse ? "-inverse" : ""}`;
  else if (
    isWithinInterval(currDate, { start: addDays(start, -3), end: start })
  )
    return "semaphore-active";
  else return "semaphore-inactive";
}
