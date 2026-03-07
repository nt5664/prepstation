import z from "zod";
import { FormFieldConfig } from "@/app/_utils/form-schemas/form-fields-base";

export const suspendFormSchema = z.object({
  reason: z
    .string()
    .min(1, "Suspension reason is required.")
    .max(200, "The suspension reason cannot be longer than 200 characters."),
});

export type SuspendFormSchema = z.infer<typeof suspendFormSchema>;

export const suspendFormFields: FormFieldConfig<SuspendFormSchema> = {
  reason: { id: "reason", maxLength: 200 },
};
