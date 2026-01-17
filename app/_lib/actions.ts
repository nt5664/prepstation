"use server";

import { revalidatePath } from "next/cache";
import {
  eventFormSchema,
  EventFormSchema,
} from "@/app/_utils/form-schemas/event";
import {
  createEvent as createEventDb,
  updateEvent,
  deleteEvent as deleteEventDb,
} from "@/app/_lib/data/event-service";

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
    : await createEventDb({
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
