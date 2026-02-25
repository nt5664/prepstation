export function parseBool(
  value: string | null | undefined,
  nullValue: boolean | undefined = undefined,
  fallback: boolean | undefined = undefined,
) {
  if (value === null) return nullValue;

  switch (value?.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return fallback;
  }
}
