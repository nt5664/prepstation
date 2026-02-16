import { prisma } from "@/app/_lib/prisma";
import { ActivityTarget } from "@/app/_data";
import { EventActivityPayload } from "@/app/_types/EventActivityPayload";
import { ScheduleActivityPayload } from "@/app/_types/ScheduleActivityPayload";
import { UserActivityPayload } from "@/app/_types/UserActivityPayload";

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
