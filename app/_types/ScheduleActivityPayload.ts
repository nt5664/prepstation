import { JsonValue } from "@prisma/client/runtime/client";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import { ExtraValue } from "@/app/_types/ExtraValue";

export type ScheduleActivityPayload =
  | {
      action: "created" | "edited";
      data: {
        stub: string;
        title: string;
        channel: string;
        website: string;
        startDate: Date;
        transition: number;
        unlisted: boolean;
        extraColumns: ExtraColumnDefinition[];
      };
    }
  | { action: "deleted" }
  | {
      action: "entries";
      data: {
        id: string;
        created: Date;
        estimate: number;
        name: string;
        extraData: ExtraValue[] | JsonValue;
      }[];
    }
  | { action: "entriesReordered"; data: { id: string; order: number }[] }
  | { action: "entriesDeleted"; data: { count: number; ids: string[] } };
