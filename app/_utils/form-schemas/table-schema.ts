import z from "zod";
import { FormFieldConfig } from "@/app/_utils/form-schemas/form-fields-base";

const extraColumnSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  key: z.string(),
});

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
  startDate: z.iso.datetime().nonoptional("Start date is required"),
  transitionTime: z
    .number("Invalid value, a positive number is required.")
    .nonnegative("The length cannot be negative"),
  channel: z
    .string()
    .max(25, "The max length is 25 characters")
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9_]+$/,
      "The channel name can only contain alphanumeric characters and underscores.",
    )
    .optional(),
  website: z
    .url("The website must be a URL")
    .max(64, "The max length is 64 characters")
    .optional(),
  extraColumns: z
    .array(extraColumnSchema)
    .max(5, "Maximum 5 extra columns are allowed."),
});

export type TableFormSchema = z.infer<typeof tableFormSchema>;

export const tableFormFields: FormFieldConfig<TableFormSchema> = {
  tableStub: { id: "tableStub", maxLength: 32 },
  tableTitle: { id: "tableTitle", maxLength: 64 },
  channel: { id: "channel", maxLength: 25 },
  website: { id: "website", maxLength: 64 },
  startDate: { id: "startDate" },
  transitionTime: { id: "transitionTime" },
  extraColumns: { id: "extraColumns", maxLength: 5 },
};
