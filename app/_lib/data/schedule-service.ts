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
    order: number;
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
                  order: x.order,
                  extraData: x.extraData,
                },
              })
            : ctx.timetableEntry.create({
                data: {
                  estimate: x.estimate,
                  name: x.name,
                  order: x.order,
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
            order: x.order,
            estimate: x.estimate,
            extraData: x.extraData,
          })),
        },
      }),
  );

  return retVal;
}

export async function updateEntryOrders(
  entryIds: string[],
  firstNum: number,
  eventId: string,
  tableId: string,
) {
  if (!entryIds.length) return null;

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

  const transaction = await prisma.$transaction(
    async (ctx) =>
      await Promise.all(
        entryIds.map(
          async (x, offset) =>
            await ctx.timetableEntry.update({
              where: { id: x, timetableId: tableId },
              data: { order: firstNum + offset },
              select: { id: true, order: true },
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
          action: "entriesReordered",
          data: transaction.map((x) => ({ id: x.id, order: x.order! })),
        },
      }),
  );

  return transaction;
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
