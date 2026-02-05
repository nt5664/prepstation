import { ExtraColumnDefinition } from "../_types/ExtraColumnDefinition";
import { ExtraValue } from "../_types/ExtraValue";

export function syncExtraData<T>(
  extraColumns: ExtraColumnDefinition[],
  extraData: ExtraValue[],
  mapFn: (column: ExtraColumnDefinition, value: string, idx: number) => T,
) {
  return extraColumns.map((x, i) => {
    const value = extraData.find((y) => y.name === x.name)?.value ?? "";
    return mapFn(x, value, i);
  });
}
