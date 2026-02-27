import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { getTimeFormatString } from "@/app/_utils/prefs";
import { getPreferredTimeFormat } from "@/app/_lib/pref-client";

type LocalTimeHookRet = Record<string, string> | string;

export function useLocalTimeString(utc: Date): string;
export function useLocalTimeString(utc: Date, formatString: string): string;
export function useLocalTimeString<const T extends LocalTimeHookRet>(
  utc: Date,
  formatFn: (date: Date) => T,
): T;

export function useLocalTimeString(
  utc: Date,
  arg: string | ((date: Date) => LocalTimeHookRet) | undefined = undefined,
) {
  const [localString, setLocalString] = useState<LocalTimeHookRet>("");

  useEffect(() => {
    if (Number.isNaN(utc.getTime())) {
      setLocalString("");
      return;
    }

    if (arg === undefined)
      setLocalString(
        format(
          utc,
          `dd MMMM yyyy ${getTimeFormatString(getPreferredTimeFormat())}`,
        ),
      );
    else if (typeof arg === "string") setLocalString(format(utc, arg));
    else setLocalString(arg(utc));
  }, [utc, arg]);

  return localString;
}
