import {
  DEFAULTS,
  PREF_NAME_SEMAPHORE,
  PREF_NAME_TIMEFORMAT,
  SemaphoreStyle,
  TimeFormat,
} from "@/app/_types/Prefs";

export function getPreferredTimeFormat() {
  return (getCookie(PREF_NAME_TIMEFORMAT) as TimeFormat) ?? DEFAULTS.timeFormat;
}

export function getPreferredSemaphoreStyle() {
  return (
    (getCookie(PREF_NAME_SEMAPHORE) as SemaphoreStyle) ??
    DEFAULTS.semaphoreStyle
  );
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  return (
    document?.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] ?? null
  );
}
