export type UserActivityPayload =
  | {
      action: "banned";
      reason: string;
    }
  | { action: "unbanned" }
  | { action: "setupPromote" };
