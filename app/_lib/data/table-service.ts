import { after } from "next/server";
import { getServerSession } from "@/app/_lib/auth";
import { isEditor, isSuperuser, isUserActive } from "@/app/_utils/user";
import { getEventHeader } from "@/app/_lib/data/event-service";
import { prisma } from "@/app/_lib/prisma";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import { deleteSchedule } from "@/app/_lib/data/schedule-service";
import {
  normalizeExtraColumns,
  normalizeExtraValues,
} from "@/app/_utils/data-serialization";
import { logSchedule } from "@/app/_lib/data/activity-service";
import { sortTableEntries } from "@/app/_utils/table";

export async function createTable(
  tableData: {
    stub: string;
    title: string;
    startDate: Date;
    transitionTime: number;
    extraColumns: ExtraColumnDefinition[];
    channel: string;
    website: string;
    unlisted: boolean;
  },
  eventName: string,
) {
  const [session, event] = await Promise.all([
    getServerSession(),
    getEventHeader(eventName),
  ]);
  if (!session || !event || !isUserAuthorized(session!.user, event!.editors))
    throw new Error("Forbidden");

  if (await stubExistsInEvent(tableData.stub, event!.id))
    throw new Error("This event already has a table with the same stub");

  const createdTable = await prisma.timetable.create({
    data: {
      ...tableData,
      delay: 0,
      eventId: event!.id,
    },
  });

  after(
    async () =>
      await logSchedule({
        instigatorId: session!.user.id,
        affectedId: createdTable.id,
        payload: {
          action: "created",
          data: {
            stub: tableData.stub,
            title: tableData.title,
            channel: tableData.channel,
            website: tableData.website,
            startDate: tableData.startDate,
            transition: tableData.transitionTime,
            unlisted: tableData.unlisted,
            extraColumns: tableData.extraColumns,
          },
        },
      }),
  );

  return createdTable;
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
      unlisted: true,
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

export async function getTableEntries(stub: string, eventId: string) {
  const table = await prisma.timetable.findFirst({
    where: {
      stub,
      eventId,
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      transitionTime: true,
      extraColumns: true,
      entries: {
        select: {
          id: true,
          createdAt: true,
          name: true,
          order: true,
          estimate: true,
          extraData: true,
        },
      },
    },
  });

  return table
    ? {
        ...table,
        extraColumns: normalizeExtraColumns(table.extraColumns),
        entries: sortTableEntries(
          table.entries.map((x) => ({
            ...x,
            extraData: normalizeExtraValues(x.extraData),
          })),
        ),
      }
    : null;
}

export async function getTableDisplayEntries(stub: string, eventName: string) {
  const table = await prisma.timetable.findFirst({
    where: {
      stub,
      event: { name: eventName },
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      transitionTime: true,
      extraColumns: true,
      entries: {
        select: {
          createdAt: true,
          name: true,
          order: true,
          estimate: true,
          extraData: true,
        },
      },
    },
  });

  return table
    ? {
        ...table,
        extraColumns: normalizeExtraColumns(table.extraColumns),
        entries: sortTableEntries(
          table.entries.map((x) => ({
            ...x,
            extraData: normalizeExtraValues(x.extraData),
          })),
        ),
      }
    : null;
}

export async function getTableStub(id: string) {
  return await prisma.timetable.findUnique({
    where: { id },
    select: { stub: true },
  });
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
    unlisted: boolean;
  },
  eventName: string,
) {
  const { id, ...tableIdless } = tableData;
  const [session, event, oldStub] = await Promise.all([
    getServerSession(),
    getEventHeader(eventName),
    getTableStub(id),
  ]);
  if (!session || !event || !isUserAuthorized(session!.user, event!.editors))
    throw new Error("Forbidden");

  if (
    oldStub?.stub !== tableIdless.stub &&
    (await stubExistsInEvent(tableData.stub, event!.id, id))
  )
    throw new Error("This event already has a table with the same stub");

  const updatedTable = await prisma.timetable.update({
    where: {
      id: tableData.id,
    },
    data: {
      ...tableIdless,
    },
  });

  after(
    async () =>
      await logSchedule({
        instigatorId: session!.user.id,
        affectedId: id,
        payload: {
          action: "edited",
          data: {
            stub: tableData.stub,
            title: tableData.title,
            channel: tableData.channel,
            website: tableData.website,
            startDate: tableData.startDate,
            transition: tableData.transitionTime,
            unlisted: tableData.unlisted,
            extraColumns: tableData.extraColumns,
          },
        },
      }),
  );

  return updatedTable;
}

export async function deleteTable(id: string, eventName: string) {
  const [session, event] = await Promise.all([
    getServerSession(),
    getEventHeader(eventName),
  ]);
  if (!session || !event || !isUserAuthorized(session!.user, event!.editors))
    throw new Error("Forbidden");

  const entries = await prisma.timetable.findUnique({
    where: { id },
    select: { eventId: true, entries: { select: { id: true } } },
  });
  if (entries && entries.entries.length)
    await deleteSchedule(
      entries.entries.map((x) => x.id),
      entries.eventId,
      id,
    );

  const deletedTable = await prisma.timetable.delete({ where: { id } });

  after(
    async () =>
      await logSchedule({
        instigatorId: session!.user.id,
        affectedId: id,
        payload: {
          action: "deleted",
        },
      }),
  );

  return deletedTable;
}

function isUserAuthorized(
  user: { id: string; status: string; role: string },
  editors: { id: string }[],
) {
  return isUserActive(user) && (isEditor(user, editors) || isSuperuser(user));
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
