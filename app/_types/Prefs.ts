export type TimeFormat = "12h" | "24h";

export type SemaphoreStyle = "animated" | "fixed" | "off";

export const PREF_NAME_TIMEFORMAT = "pref_prepstation_TimeFormat";
export const PREF_NAME_SEMAPHORE = "pref_prepstation_SemaphoreStyle";

export const DEFAULTS = {
  timeFormat: "24h" as TimeFormat,
  semaphoreStyle: "animated" as SemaphoreStyle,
};
