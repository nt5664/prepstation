import { TimeFormat } from "@/app/_types/Prefs";

export function getTimeFormatString(format: TimeFormat) {
  switch (format) {
    case "24h":
      return "HH:mm";
    case "12h":
      return "hh:mm aa";
  }
}
