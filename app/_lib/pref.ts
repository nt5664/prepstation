import { cookies } from "next/headers";
import {
  DEFAULTS,
  PREF_NAME_SEMAPHORE,
  PREF_NAME_TIMEFORMAT,
  SemaphoreStyle,
  TimeFormat,
} from "@/app/_types/Prefs";

export async function getPrefTimeFormat() {
  return (
    ((await getCookie(PREF_NAME_TIMEFORMAT)) as TimeFormat) ??
    DEFAULTS.timeFormat
  );
}

export async function getPrefSemaphoreStyle() {
  return (
    ((await getCookie(PREF_NAME_SEMAPHORE)) as SemaphoreStyle) ??
    DEFAULTS.semaphoreStyle
  );
}

async function getCookie(name: string) {
  return (await cookies()).get(name)?.value ?? null;
}
