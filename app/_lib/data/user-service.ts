import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser, isUserActive } from "@/app/_utils/user";

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

export async function getUsersByName(name: string) {
  return await prisma.user.findMany({
    where: { name: { equals: name, mode: "insensitive" } },
  });
}

export async function getUserDataById(id: string) {
  const session = await getServerSession();
  if (!isUserActive(session?.user) || !isSuperuser(session!.user))
    throw new Error("Forbidden");

  return await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      modNote: true,
      events: { select: { name: true, title: true } },
      editorOf: {
        where: { creatorId: { not: id } },
        select: { name: true, title: true },
      },
      activity: {
        select: {
          createdAt: true,
          affects: true,
          affectedId: true,
          payload: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
      reports: {
        select: {
          createdAt: true,
          message: true,
          handled: true,
          reported: { select: { name: true, title: true } },
        },
      },
      reportsHandled: true,
    },
  });
}

export async function getUsersBySearchString(search: string) {
  const session = await getServerSession();
  if (!isUserActive(session?.user) || !isSuperuser(session!.user))
    throw new Error("Forbidden");

  return await prisma.user.findMany({
    where: { name: { startsWith: search, mode: "insensitive" } },
    select: { id: true, name: true, image: true, role: true, status: true },
  });
}
