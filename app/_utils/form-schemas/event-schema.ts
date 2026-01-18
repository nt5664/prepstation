import z from "zod";
import { FormFieldConfig } from "@/app/_utils/form-schemas/form-fields-base";

export const eventFormSchema = z.object({
  eventName: z
    .string()
    .min(1, "Event name is required.")
    .max(32, "The max length is 32 characters.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "The name can only contain alphanumeric characters and dashes.",
    ),
  eventTitle: z
    .string()
    .min(1, "The title is required.")
    .max(64, "The max length is 64 characters."),
  description: z.string().max(200, "The max length is 200 characters."),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;

export const eventFormFields: FormFieldConfig<EventFormSchema> = {
  eventName: { id: "eventName", maxLength: 32 },
  eventTitle: { id: "eventTitle", maxLength: 64 },
  description: { id: "description", maxLength: 200 },
};
