import type { FieldValues, Path } from "react-hook-form";

export type FormFieldConfig<TForm extends FieldValues> = {
  [K in Path<TForm>]: { id: K; maxLength?: number };
};
