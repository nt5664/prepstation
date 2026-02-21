import { QueryRange } from "@/app/_types/QueryRange";
import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser, isUserActive } from "@/app/_utils/user";

export async function getReports({
  handled,
  range,
}: {
  handled?: boolean;
  range?: QueryRange;
}) {
  const session = await getServerSession();
  if (!isUserActive(session?.user) || !isSuperuser(session!.user))
    throw new Error("Forbidden");

  return await prisma.report.findMany({
    where: {
      handled,
      createdAt: range
        ? {
            gte: range.from,
            lte: range.to,
          }
        : undefined,
    },
  });
}

export async function createReport({
  message,
  eventId,
}: {
  message: string;
  eventId: string;
}) {
  const session = await getServerSession();
  if (!isUserActive(session?.user)) throw new Error("Forbidden");

  return await prisma.report.create({
    data: {
      message,
      reporterId: session!.user.id,
      reportedId: eventId,
    },
    select: { message: true },
  });
}
