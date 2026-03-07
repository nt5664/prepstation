import { prisma } from "@/app/_lib/prisma";
import { ActivityTarget } from "@/data";
import { EventActivityPayload } from "@/app/_types/EventActivityPayload";
import { ScheduleActivityPayload } from "@/app/_types/ScheduleActivityPayload";
import { UserActivityPayload } from "@/app/_types/UserActivityPayload";
import { QueryRange } from "@/app/_types/QueryRange";
import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser } from "@/app/_utils/user";
import { PaginationRange } from "@/app/_types/PaginationRange";
import { UnitedPayload } from "@/app/_types/ActivityData";

type AcceptedPayloads =
  | EventActivityPayload
  | ScheduleActivityPayload
  | UserActivityPayload;

type LogParams<TPayload extends AcceptedPayloads> = {
  instigatorId: string;
  affectedId: string;
  payload: TPayload;
};

export async function logEvent(params: LogParams<EventActivityPayload>) {
  return await doLog("EVENT", params);
}

export async function logSchedule(params: LogParams<ScheduleActivityPayload>) {
  return await doLog("SCHEDULE", params);
}

export async function logUser(params: LogParams<UserActivityPayload>) {
  return await doLog("USER", params);
}

async function doLog<T extends AcceptedPayloads>(
  target: ActivityTarget,
  { instigatorId, affectedId, payload }: LogParams<T>,
) {
  return await prisma.activityHistory.create({
    data: {
      instigatorId,
      affects: target,
      affectedId,
      payload,
    },
  });
}

export async function getActivities({
  target,
  range,
}: {
  target: ActivityTarget | "all";
  range?: QueryRange;
}) {
  const session = await getServerSession();
  if (!isSuperuser(session?.user)) throw new Error("Forbidden");

  const activities = await prisma.activityHistory.findMany({
    where: {
      affects: target !== "all" ? target : undefined,
      createdAt: range ? { gte: range.from, lte: range.to } : undefined,
    },
  });

  return activities.map((x) => ({ ...x, payload: x.payload as UnitedPayload }));
}

export async function getActivitiesOfUser(
  userId: string,
  { page, size }: PaginationRange,
) {
  const session = await getServerSession();
  if (!isSuperuser(session?.user)) throw new Error("Forbidden");

  const activities = await prisma.activityHistory.findMany({
    where: { instigatorId: userId },
    select: {
      id: true,
      createdAt: true,
      affects: true,
      affectedId: true,
      payload: true,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * size,
    take: size + 1,
  });

  return activities.map((x) => ({ ...x, payload: x.payload as UnitedPayload }));
}
