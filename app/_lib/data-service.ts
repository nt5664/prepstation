import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "@/app/_lib/auth";
import { isUserActive } from "../_utils/user";

export async function createUser(platformId: string, name: string) {
  return await prisma.user.create({
    data: {
      name,
      platformId,
      role: "USER",
      status: "ACTIVE",
    },
  });
}

export async function getUser(id: string) {
  return await prisma.user.findUnique({ where: { platformId: id } });
}

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
  if (editors.length) {
    editorIds.push(
      ...(await prisma.user.findMany({
        where: {
          name: {
            in: editors,
          },
        },
        select: {
          id: true,
        },
      }))
    );
  }

  const { name: savedName } = await prisma.event.create({
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

  revalidatePath("/user/events");
  redirect(`/events/${savedName}`);
}

export async function getEventSummary(name: string) {
  return await prisma.event.findUnique({
    where: {
      name,
      visibility: "ACTIVE",
    },
    select: {
      title: true,
      description: true,
      editors: { select: { name: true } },
      schedules: { select: { stub: true, title: true, startDate: true } },
    },
  });
}
