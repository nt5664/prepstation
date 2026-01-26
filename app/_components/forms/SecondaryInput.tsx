import clsx from "clsx";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

export default function SecondaryInput({
  placeholder,
  value,
  className,
  onChange,
  onBlur,
}: Readonly<{
  placeholder?: string;
  value: string | number;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}>) {
  return (
    <input
      className={twMerge(
        clsx(
          "mx-0.5 px-1 w-full rounded-sm border-2 bg-gray-600 border-cyan-600 placeholder:italic focus:border-cyan-400 focus:text-cyan-400 focus:outline-0",
          className
        )
      )}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
