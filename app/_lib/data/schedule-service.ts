import { isEditor, isSuperuser, isUserActive } from "@/app/_utils/user";
import { getServerSession } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { getEditorsById } from "@/app/_lib/data/event-service";
import { getTableStub } from "@/app/_lib/data/table-service";

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

  await prisma.$transaction(
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

  return prisma.timetableEntry.deleteMany({
    where: { id: { in: entryIds }, timetableId: tableId },
  });
}

async function isUserAuthorized(
  user: { id: string; status: string; role: string },
  editors: { id: string }[],
) {
  return isUserActive(user) && (isEditor(user, editors) || isSuperuser(user));
}
