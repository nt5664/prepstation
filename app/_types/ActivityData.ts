import { EventActivityPayload } from "@/app/_types/EventActivityPayload";
import { ScheduleActivityPayload } from "@/app/_types/ScheduleActivityPayload";
import { UserActivityPayload } from "@/app/_types/UserActivityPayload";

export type UnitedPayload =
  | EventActivityPayload
  | ScheduleActivityPayload
  | UserActivityPayload;

export type ActivityData = {
  id: string;
  createdAt: Date;
  affects: string;
  affectedId: string | null;
  payload: UnitedPayload;
};
