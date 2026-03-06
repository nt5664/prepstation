import { endOfDay, isToday, startOfDay } from "date-fns";
import DashboardCard from "@/app/_components/DashboardCard";
import StatRow from "@/app/_components/StatRow";
import { getActivities } from "@/app/_lib/data/activity-service";
import { getReports } from "@/app/_lib/data/report-service";
import { getUserCount } from "@/app/_lib/data/user-service";

export default async function ModDashboard() {
  const now = new Date();
  const [todayActivities, unresolvedReports, { allUsers, suspendedUsers }] =
    await Promise.all([
      getActivities({
        target: "all",
        range: { from: startOfDay(now), to: endOfDay(now) },
      }),
      getReports({ handled: false }),
      getUserCount(),
    ]);

  const {
    events: todayEvents,
    schedules: todaySchedules,
    users: todayUsers,
  } = todayActivities.reduce(
    (acc, cur) => {
      switch (cur.affects) {
        case "EVENT":
          return { ...acc, events: acc.events + 1 };
        case "SCHEDULE":
          return { ...acc, schedules: acc.schedules + 1 };
        case "USER":
          return { ...acc, users: acc.users + 1 };
      }
    },
    { events: 0, schedules: 0, users: 0 },
  );

  const { eventChanges, scheduleChanges, entryChanges } = todayActivities
    .filter((x) => x.affects !== "USER")
    .reduce(
      (acc, cur) => {
        switch (cur.affects) {
          case "EVENT":
            return { ...acc, eventChanges: acc.eventChanges + 1 };
          case "SCHEDULE":
            return cur.payload.action === "entries" ||
              cur.payload.action === "entriesDeleted" ||
              cur.payload.action === "entriesReordered"
              ? { ...acc, entryChanges: acc.entryChanges + 1 }
              : { ...acc, scheduleChanges: acc.scheduleChanges + 1 };
          default:
            return acc;
        }
      },
      { eventChanges: 0, scheduleChanges: 0, entryChanges: 0 },
    );

  return (
    <div className="grid grid-cols-4 gap-3">
      <DashboardCard title="Today's activity">
        <div className="flex flex-col text-cyan-100">
          <StatRow title="Events" coloring="neutral" value={todayEvents} />
          <StatRow
            title="Schedules"
            coloring="neutral"
            value={todaySchedules}
          />
          <StatRow title="Users" coloring="neutral" value={todayUsers} />
        </div>
      </DashboardCard>

      <DashboardCard title="Reports" href="/mod/reports">
        <div className="flex flex-col text-cyan-100">
          <StatRow title="Unresolved" value={unresolvedReports.length} />
          <StatRow
            title="From today"
            value={unresolvedReports.filter((x) => isToday(x.createdAt)).length}
          />
        </div>
      </DashboardCard>

      <DashboardCard title="Events" href="/mod/events">
        <div className="flex flex-col text-cyan-100">
          <StatRow
            title="Changes today"
            coloring="neutral"
            value={eventChanges}
          />
          <StatRow
            title="Schedule changes"
            coloring="neutral"
            value={scheduleChanges}
          />
          <StatRow
            title="Schedule entries"
            coloring="neutral"
            value={entryChanges}
          />
        </div>
      </DashboardCard>

      <DashboardCard title="Users" href="/mod/users">
        <div className="flex flex-col text-cyan-100">
          <StatRow title="Suspended" value={suspendedUsers} />
          <StatRow title="All" coloring="neutral" value={allUsers} />
        </div>
      </DashboardCard>
    </div>
  );
}
