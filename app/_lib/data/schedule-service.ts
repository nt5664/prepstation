import { after } from "next/server";
import { isEditor, isSuperuser, isUserActive } from "@/app/_utils/user";
import { getServerSession } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { getEditorsById } from "@/app/_lib/data/event-service";
import { getTableStub } from "@/app/_lib/data/table-service";
import { logSchedule } from "@/app/_lib/data/activity-service";

export async function submitSchedule(
  entries: {
    id?: string | null;
    estimate: number;
    name: string;
    extraData: { name: string; value: string }[];
  }[],
  { eventId, tableId }: { eventId: string; tableId: string },
) {
  const [session, event, stub] = await Promise.all([
    getServerSession(),
    getEditorsById(eventId),
    getTableStub(tableId),
  ]);

  if (
    !session ||
    !event ||
    !stub ||
    !isUserAuthorized(session!.user, event!.editors)
  )
    throw new Error("Forbidden");

  const retVal = { eventName: event.name, tableStub: stub.stub };
  if (!entries.length) return retVal;

  const transaction = await prisma.$transaction(
    async (ctx) =>
      await Promise.all(
        entries.map((x) =>
          x.id
            ? ctx.timetableEntry.update({
                where: { id: x.id!, timetableId: tableId },
                data: {
                  estimate: x.estimate,
                  name: x.name,
                  extraData: x.extraData,
                },
              })
            : ctx.timetableEntry.create({
                data: {
                  estimate: x.estimate,
                  name: x.name,
                  extraData: x.extraData,
                  timetableId: tableId,
                },
              }),
        ),
      ),
  );

  after(
    async () =>
      await logSchedule({
        instigatorId: session!.user.id,
        affectedId: tableId,
        payload: {
          action: "entries",
          data: transaction.map((x) => ({
            id: x.id,
            created: x.createdAt,
            name: x.name,
            estimate: x.estimate,
            extraData: x.extraData,
          })),
        },
      }),
  );

  return retVal;
}

export async function deleteSchedule(
  entryIds: string[],
  eventId: string,
  tableId: string,
) {
  const [session, event, stub] = await Promise.all([
    getServerSession(),
    getEditorsById(eventId),
    getTableStub(tableId),
  ]);

  if (
    !session ||
    !event ||
    !stub ||
    !isUserAuthorized(session!.user, event!.editors)
  )
    throw new Error("Forbidden");

  const deletedEntries = await prisma.timetableEntry.deleteMany({
    where: { id: { in: entryIds }, timetableId: tableId },
  });

  after(
    async () =>
      await logSchedule({
        instigatorId: session!.user.id,
        affectedId: tableId,
        payload: {
          action: "entriesDeleted",
          data: { count: deletedEntries.count, ids: entryIds },
        },
      }),
  );

  return deletedEntries;
}

async function isUserAuthorized(
  user: { id: string; status: string; role: string },
  editors: { id: string }[],
) {
  return isUserActive(user) && (isEditor(user, editors) || isSuperuser(user));
}
