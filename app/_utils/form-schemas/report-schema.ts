import z from "zod";
import { FormFieldConfig } from "@/app/_utils/form-schemas/form-fields-base";

export const reportFormSchema = z.object({
  message: z
    .string()
    .min(1, "Report message is required.")
    .max(200, "The report message cannot be longer than 200 chaarcters."),
});

export type ReportFormSchema = z.infer<typeof reportFormSchema>;

export const reportFormFields: FormFieldConfig<ReportFormSchema> = {
  message: { id: "message", maxLength: 200 },
};
