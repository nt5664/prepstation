"use server";

import { revalidatePath } from "next/cache";
import {
  eventFormSchema,
  EventFormSchema,
} from "@/app/_utils/form-schemas/event-schema";
import {
  tableFormSchema,
  TableFormSchema,
} from "@/app/_utils/form-schemas/table-schema";
import {
  createEvent,
  updateEvent,
  deleteEvent as deleteEventDb,
} from "@/app/_lib/data/event-service";
import { createTable, updateTable } from "./data/table-service";

export async function saveEvent(
  data: EventFormSchema,
  id: string | null = null,
) {
  const {
    eventName: name,
    eventTitle: title,
    description,
  } = eventFormSchema.parse(data);

  const { name: savedName } = id
    ? await updateEvent({ id, name, title, description, editors: [] })
    : await createEvent({
        name,
        title,
        description,
        editors: [],
      });

  revalidatePath("/user/events");
  return savedName;
}

export async function deleteEvent(id: string) {
  const res = deleteEventDb(id);

  revalidatePath("/user/events");
  return res;
}

export async function saveTable(
  data: TableFormSchema,
  eventName: string,
  id: string | null = null,
) {
  const {
    tableStub: stub,
    tableTitle: title,
    startDate,
    transitionTime,
    channel,
    website,
    extraColumns,
  } = tableFormSchema.parse(data);

  const objCommon = {
    stub,
    title,
    startDate: new Date(startDate),
    transitionTime,
    channel: channel ?? "",
    website: website ?? "",
    extraColumns: extraColumns ?? [],
  };

  const { stub: savedStub } = id
    ? await updateTable({ id, ...objCommon }, eventName)
    : await createTable(objCommon, eventName);

  revalidatePath("/user/events");
  revalidatePath(`/events`);
  return savedStub;
}
