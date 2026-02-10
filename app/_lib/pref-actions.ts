"use server";

import { cookies as getCookies } from "next/headers";
import {
  PREF_NAME_SEMAPHORE,
  PREF_NAME_TIMEFORMAT,
  SemaphoreStyle,
  TimeFormat,
} from "@/app/_types/Prefs";

const COOKIE_MAXAGE = 60 * 60 * 24 * 365;

export async function setTimeFormat(format: TimeFormat) {
  const cookies = await getCookies();
  cookies.set(PREF_NAME_TIMEFORMAT, format, {
    path: "/",
    sameSite: "lax",
    maxAge: COOKIE_MAXAGE,
  });
}

export async function setSemaphoreStyle(style: SemaphoreStyle) {
  const cookies = await getCookies();
  cookies.set(PREF_NAME_SEMAPHORE, style, {
    path: "/",
    sameSite: "lax",
    maxAge: COOKIE_MAXAGE,
  });
}
