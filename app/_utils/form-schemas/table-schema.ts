import z from "zod";
import { FormFieldConfig } from "@/app/_utils/form-schemas/form-fields-base";

export const tableFormSchema = z.object({
  tableStub: z
    .string()
    .min(1, "Table stub is required")
    .max(32, "The max length is 32 characters.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "The stub can only contain alphanumeric characters and dashes.",
    ),
  tableTitle: z
    .string()
    .min(1, "The title is required.")
    .max(64, "The max length is 64 characters"),
  startDate: z
    .date("Invalid date. A valid start date is required.")
    .nonoptional("Start date is required."),
  transitionTime: z
    .number("Invalid value, a positive number is required.")
    .nonnegative("The length cannot be negative")
    .nonoptional("Transition time is required."),
  extraColumns: z.string().optional(),
});

export type TableFormSchema = z.infer<typeof tableFormSchema>;

export const tableFormFields: FormFieldConfig<TableFormSchema> = {
  tableStub: { id: "tableStub", maxLength: 32 },
  tableTitle: { id: "tableTitle", maxLength: 64 },
  startDate: { id: "startDate" },
  transitionTime: { id: "transitionTime" },
  extraColumns: { id: "extraColumns" },
};
