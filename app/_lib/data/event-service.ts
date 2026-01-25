import { getServerSession } from "@/app/_lib/auth";
import { prisma } from "@/app/_lib/prisma";
import { isSuperuser, isUserActive } from "@/app/_utils/user";
import { deleteTable } from "@/app/_lib/data/table-service";

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

  const editorIds = [{ id: session!.user.internalId }];
  const remainingEditors = editors.filter(
    (x) => x !== session!.user.internalId,
  );
  if (remainingEditors.length) {
    editorIds.push(
      ...(await prisma.user.findMany({
        where: {
          name: {
            in: remainingEditors,
          },
        },
        select: {
          id: true,
        },
      })),
    );
  }

  return await prisma.event.create({
    data: {
      name,
      title,
      description,
      creatorId: session!.user.internalId,
      editors: {
        connect: editorIds,
      },
    },
  });
}

export async function getEventData(name: string) {
  return await prisma.event.findUnique({
    where: { name },
    select: {
      id: true,
      name: true,
      title: true,
      description: true,
      editors: { select: { id: true } },
    },
  });
}

export async function getEventSummary(name: string) {
  return await prisma.event.findUnique({
    where: {
      name,
      visibility: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
      description: true,
      editors: { select: { name: true } },
      schedules: { select: { stub: true, title: true, startDate: true } },
    },
  });
}

export async function getEditorsById(id: string) {
  return await prisma.event.findUnique({
    where: { id },
    select: { name: true, editors: { select: { id: true } } },
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

  const editorIds = [{ id: session!.user.internalId }];
  const remainingEditors = editors.filter(
    (x) => x !== session!.user.internalId && x !== oldEditors?.creatorId,
  );
  if (remainingEditors.length) {
    editorIds.push(
      ...(await prisma.user.findMany({
        where: {
          name: {
            in: remainingEditors,
          },
        },
        select: {
          id: true,
        },
      })),
    );
  }

  return await prisma.event.update({
    where: { id },
    data: { name, title, description, editors: { set: editorIds } },
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
    (event!.creatorId !== session!.user.internalId &&
      !isSuperuser(session!.user))
  )
    throw new Error("Forbidden");

  if (event!.schedules.length)
    await prisma.$transaction(
      async () =>
        await Promise.all(
          event!.schedules.map((x) => deleteTable(x.id, event!.name)),
        ),
    );

  return await prisma.event.delete({ where: { id } });
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
