"use client";

import { Control, FieldValues, Path, useWatch } from "react-hook-form";

export default function InputLengthCounter<T extends FieldValues>({
  control,
  name,
  maxLength,
}: Readonly<{
  control: Control<T>;
  name: Path<T>;
  maxLength: number;
}>) {
  const { length } = useWatch<T, Path<T>>({
    control,
    name,
  });

  return (
    <span
      className={`inline-block text-xs ${
        length > maxLength ? "text-rose-400" : ""
      }`}
    >
      {length}/{maxLength}
    </span>
  );
}
