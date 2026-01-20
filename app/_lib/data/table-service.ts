import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser, isUserActive } from "@/app/_utils/user";
import { getEventData } from "@/app/_lib/data/event-service";
import { prisma } from "@/app/_lib/prisma";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";

export async function createTable(
  tableData: {
    stub: string;
    title: string;
    startDate: Date;
    transitionTime: number;
    extraColumns: ExtraColumnDefinition[];
    channel: string;
    website: string;
  },
  eventName: string,
) {
  const [session, event] = await Promise.all([
    getServerSession(),
    getEventData(eventName),
  ]);
  if (!session || !event || !isUserAuthorized(session!.user, event!.editors))
    throw new Error("Forbidden");

  if (await stubExistsInEvent(tableData.stub, event!.id))
    throw new Error("This event already has a table with the same stub");

  return await prisma.timetable.create({
    data: {
      ...tableData,
      delay: 0,
      eventId: event!.id,
    },
  });
}

export async function getTableSummary(stub: string, eventId: string) {
  const table = await prisma.timetable.findFirst({
    where: {
      stub,
      eventId,
    },
    select: {
      id: true,
      stub: true,
      title: true,
      startDate: true,
      transitionTime: true,
      extraColumns: true,
      channel: true,
      website: true,
    },
  });

  return table
    ? {
        ...table,
        extraColumns: Array.isArray(table.extraColumns)
          ? (table.extraColumns as ExtraColumnDefinition[])
          : [],
      }
    : null;
}

export async function updateTable(
  tableData: {
    id: string;
    stub: string;
    title: string;
    startDate: Date;
    transitionTime: number;
    extraColumns: ExtraColumnDefinition[];
    channel: string;
    website: string;
  },
  eventName: string,
) {
  const { id, ...tableIdless } = tableData;
  const [session, event, oldStub] = await Promise.all([
    getServerSession(),
    getEventData(eventName),
    getOldStub(id),
  ]);
  if (!session || !event || !isUserAuthorized(session!.user, event!.editors))
    throw new Error("Forbidden");

  if (
    oldStub?.stub !== tableIdless.stub &&
    (await stubExistsInEvent(tableData.stub, event!.id, id))
  )
    throw new Error("This event already has a table with the same stub");

  return await prisma.timetable.update({
    where: {
      id: tableData.id,
    },
    data: {
      ...tableIdless,
    },
  });
}

function isUserAuthorized(
  user: { id: string; status: string; role: string },
  editors: { id: string }[],
) {
  return (
    isUserActive(user) &&
    (editors.some((x) => x.id === user.id) || isSuperuser(user))
  );
}

async function stubExistsInEvent(
  stub: string,
  eventId: string,
  id?: string | null,
) {
  return (
    (await prisma.timetable.count({
      where: id ? { id, stub, eventId } : { stub, eventId },
    })) > 0
  );
}

async function getOldStub(id: string) {
  return await prisma.timetable.findUnique({
    where: { id },
    select: { stub: true },
  });
}
