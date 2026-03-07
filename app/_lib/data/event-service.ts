import { after } from "next/server";
import { getServerSession } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { isSuperuser, isUserActive } from "@/app/_utils/user";
import { deleteTable } from "@/app/_lib/data/table-service";
import { logEvent } from "@/app/_lib/data/activity-service";

export async function createEvent({
  name,
  title,
  description,
  editors,
}: {
  name: string;
  title: string;
  description: string;
  editors: string[];
}) {
  const session = await getServerSession();
  if (!session || !isUserActive(session.user)) throw new Error("Forbidden");

  const editorIds = new Set([session!.user.id, ...editors]);

  const createdEvent = await prisma.event.create({
    data: {
      name,
      title,
      description,
      creatorId: session!.user.id,
      editors: {
        connect: Array.from(editorIds).map((x) => ({ id: x })),
      },
    },
  });

  after(
    async () =>
      await logEvent({
        instigatorId: session!.user.id,
        affectedId: createdEvent.id,
        payload: {
          action: "created",
          data: {
            name,
            title,
            description,
            visibility: createdEvent.visibility,
            editors: Array.from(editorIds),
          },
        },
      }),
  );

  return createdEvent;
}

export async function getEventHeader(name: string) {
  return await prisma.event.findUnique({
    where: { name },
    select: {
      id: true,
      name: true,
      title: true,
      description: true,
      creator: { select: { id: true, name: true } },
      editors: { select: { id: true, name: true } },
    },
  });
}

export async function getEventWithTables(name: string) {
  return await prisma.event.findUnique({
    where: {
      name,
      visibility: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
      description: true,
      creator: { select: { name: true } },
      editors: { select: { name: true } },
      schedules: {
        select: {
          id: true,
          stub: true,
          title: true,
          transitionTime: true,
          startDate: true,
          entries: { select: { estimate: true } },
          unlisted: true,
        },
      },
    },
  });
}

export async function getEventWithTable(name: string, stub: string) {
  return prisma.event.findUnique({
    where: { name },
    select: {
      title: true,
      schedules: {
        where: { stub },
        select: {
          title: true,
          startDate: true,
          channel: true,
          website: true,
          unlisted: true,
        },
        take: 1,
      },
    },
  });
}

export async function getEventsOfUser(userId: string) {
  return await prisma.event.findMany({
    where: { creatorId: userId },
    select: {
      name: true,
      title: true,
      schedules: { select: { startDate: true } },
    },
  });
}

export async function getEditedEventsOfUser(userId: string) {
  return await prisma.event.findMany({
    where: { editors: { some: { id: userId } }, creatorId: { not: userId } },
    select: {
      name: true,
      title: true,
      schedules: { select: { startDate: true } },
    },
  });
}

export async function getEditorsById(id: string) {
  return await prisma.event.findUnique({
    where: { id },
    select: { name: true, editors: { select: { id: true } } },
  });
}

export async function getEventsBySearchString(search: string) {
  const session = await getServerSession();
  if (!isSuperuser(session?.user)) throw new Error("Forbidden");

  const events = await prisma.event.findMany({
    where: { name: { startsWith: search, mode: "insensitive" } },
    select: {
      id: true,
      name: true,
      title: true,
      editors: { select: { name: true } },
      visibility: true,
      _count: { select: { schedules: true } },
    },
  });

  return events.map((x) => ({
    ...x,
    tables: x._count.schedules,
    _count: undefined,
  }));
}

export async function getEventData(id: string) {
  const session = await getServerSession();
  if (!isSuperuser(session?.user)) throw new Error("Forbidden");

  return await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      title: true,
      description: true,
      visibility: true,
      modNote: true,
      creator: { select: { id: true, name: true, image: true } },
      editors: { select: { id: true, name: true, image: true } },
      schedules: {
        select: {
          stub: true,
          title: true,
          startDate: true,
          _count: { select: { entries: true } },
        },
      },
      reports: {
        select: {
          id: true,
          createdAt: true,
          message: true,
          reporter: { select: { id: true, name: true } },
          handled: true,
          handledBy: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function updateEvent({
  id,
  name,
  title,
  description,
  editors,
}: {
  id: string;
  name: string;
  title: string;
  description: string;
  editors: string[];
}) {
  const [session, oldEditors] = await Promise.all([
    getServerSession(),
    getEventEditorsById(id),
  ]);
  if (
    !session ||
    !isUserActive(session!.user) ||
    !(
      oldEditors?.editors.map((x) => x.name).includes(session!.user.name) ??
      false
    )
  )
    throw new Error("Forbidden");

  const editorIds = new Set([
    oldEditors!.creatorId,
    session!.user.id,
    ...editors,
  ]);

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      name,
      title,
      description,
      editors: { set: Array.from(editorIds).map((x) => ({ id: x })) },
    },
  });

  after(
    async () =>
      await logEvent({
        instigatorId: session!.user.id,
        affectedId: id,
        payload: {
          action: "edited",
          data: {
            name,
            title,
            description,
            visibility: updatedEvent.visibility,
            editors: Array.from(editorIds),
          },
        },
      }),
  );

  return updatedEvent;
}

export async function updateEventVisibility({
  id,
  suspend,
  reason,
}: {
  id: string;
  suspend: boolean;
  reason?: string;
}) {
  const session = await getServerSession();
  if (!isSuperuser(session?.user)) throw new Error("Forbidden");

  return await prisma.event.update({
    where: { id, visibility: { not: suspend ? "HIDDEN" : "ACTIVE" } },
    data: {
      visibility: suspend ? "HIDDEN" : "ACTIVE",
      modNote: suspend ? reason : null,
    },
    select: { visibility: true },
  });
}

export async function deleteEvent(id: string) {
  const [session, event] = await Promise.all([
    getServerSession(),
    prisma.event.findUnique({
      where: { id },
      select: {
        name: true,
        schedules: { select: { id: true } },
        creatorId: true,
      },
    }),
  ]);

  if (
    !session ||
    !event ||
    !isUserActive(session!.user) ||
    (event!.creatorId !== session!.user.id && !isSuperuser(session!.user))
  )
    throw new Error("Forbidden");

  if (event!.schedules.length)
    await prisma.$transaction(
      async () =>
        await Promise.all(
          event!.schedules.map((x) => deleteTable(x.id, event!.name)),
        ),
    );

  const deletedEvent = await prisma.event.delete({ where: { id } });

  after(
    async () =>
      await logEvent({
        instigatorId: session!.user.id,
        affectedId: id,
        payload: {
          action: "deleted",
        },
      }),
  );

  return deletedEvent;
}

async function getEventEditorsById(eventId: string) {
  return await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      creatorId: true,
      editors: { select: { name: true } },
    },
  });
}
