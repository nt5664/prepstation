import z from "zod";
import { FormFieldConfig } from "@/app/_utils/form-schemas/form-fields-base";

export const banFormSchema = z.object({
  reason: z
    .string()
    .min(1, "Ban reason is required.")
    .max(200, "The ban reason cannot be longer than 200 characters."),
});

export type BanFormSchema = z.infer<typeof banFormSchema>;

export const banFormFields: FormFieldConfig<BanFormSchema> = {
  reason: { id: "reason", maxLength: 200 },
};
