import z from "zod";

const extraValueSchema = z.object({
  name: z.string(),
  value: z.string().max(50, "The max length is 50 characters."),
});

const matchSchema = z.object({
  id: z.uuid().nullable(),
  name: z
    .string()
    .min(1, "The name is required.")
    .max(50, "The max length is 50 characters."),
  estimate: z
    .number()
    .int()
    .min(1, "The length must be at least 1 minute.")
    .max(1440, "The length cannot be longer than 24 hours"),
  extraData: z
    .array(extraValueSchema)
    .max(5, "Maximum 5 extra columns are allowed."),
});

export const scheduleFormSchema = z.object({
  matches: z.array(matchSchema),
});

export type ScheduleFormSchema = z.infer<typeof scheduleFormSchema>;
