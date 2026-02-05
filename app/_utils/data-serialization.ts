import { JsonValue } from "@prisma/client/runtime/client";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import { ExtraValue } from "@/app/_types/ExtraValue";

export function normalizeExtraColumns(columns: JsonValue) {
  return Array.isArray(columns) ? (columns as ExtraColumnDefinition[]) : [];
}

export function normalizeExtraValues(values: JsonValue) {
  return Array.isArray(values) ? (values as ExtraValue[]) : [];
}
