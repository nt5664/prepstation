import { prisma } from "@/app/_lib/prisma";

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
