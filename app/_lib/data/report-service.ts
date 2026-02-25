import { prisma } from "@/app/_lib/prisma";
import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser, isUserActive } from "@/app/_utils/user";
import { ReportFilter } from "@/app/_types/ReportFilter";
import { endOfDay, startOfDay } from "date-fns";

export async function getReports({ handled, range, pagination }: ReportFilter) {
  const session = await getServerSession();
  if (!isUserActive(session?.user) || !isSuperuser(session!.user))
    throw new Error("Forbidden");

  return await prisma.report.findMany({
    where: {
      handled,
      createdAt: range
        ? {
            gte: startOfDay(range.from),
            lte: endOfDay(range.to),
          }
        : undefined,
    },
    ...(pagination
      ? {
          skip: (pagination.page - 1) * pagination.size,
          take: pagination.size + 1,
        }
      : {}),
    select: {
      id: true,
      createdAt: true,
      reporter: { select: { name: true } },
      reporterId: true,
      reported: { select: { name: true, title: true } },
      message: true,
      handled: true,
      handledBy: { select: { name: true } },
      handledAt: true,
    },
    orderBy: { createdAt: "desc" },
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

export async function markReportAsHandled(id: string) {
  const session = await getServerSession();
  if (!isUserActive(session?.user) || !isSuperuser(session!.user))
    throw new Error("Forbidden");

  return await prisma.report.update({
    where: { id, handled: false },
    data: {
      handled: true,
      handledAt: new Date(),
      handlerId: session!.user.id,
    },
    select: {
      id: true,
      handled: true,
    },
  });
}
