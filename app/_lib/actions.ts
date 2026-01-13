"use server";

import {
  eventFormSchema,
  EventFormSchema,
} from "@/app/_utils/form-schemas/event";
import { createEvent as createEventDb } from "@/app/_lib/data-service";

export async function createEvent(data: EventFormSchema) {
  // zod schema & validation
  const {
    eventName: name,
    eventTitle: title,
    description,
  } = eventFormSchema.parse(data);

  await createEventDb({ name, title, description, editors: [] });
}
