export type EventActivityPayload =
  | {
      action: "created" | "edited";
      data: {
        name: string;
        title: string;
        description: string;
        visibility: string;
        editors: string[];
      };
    }
  | { action: "suspended"; reason: string }
  | { action: "deleted" | "restored" };
