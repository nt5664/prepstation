import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export enum InputType {
  Text = "text",
  LongText = "textarea",
  Number = "number",
  DateTime = "datetime-local",
}

export default function Input({
  type = InputType.Text,
  id,
  placeholder,
  title,
  hasError = false,
  className,
  registerAttributes,
}: Readonly<{
  type?: InputType;
  id: string;
  placeholder?: string;
  title?: string;
  hasError?: boolean;
  className?: string;
  registerAttributes: UseFormRegisterReturn;
}>) {
  const style = twMerge(
    clsx(
      "w-full px-1 py-0.5 border-2 rounded-sm font-medium placeholder-gray-400 text-gray-300 bg-gray-700",
      hasError ? "border-rose-400" : "border-cyan-700",
      "focus:border-cyan-500 focus:text-cyan-300 focus:outline-0 placeholder:font-normal placeholder:italic",
      className,
    ),
  );

  if (type === InputType.LongText)
    return (
      <textarea
        id={id}
        placeholder={placeholder}
        title={title}
        className={style}
        {...registerAttributes}
      />
    );
  else
    return (
      <input
        id={id}
        type={type === InputType.Number ? "text" : type.toString()}
        placeholder={placeholder}
        title={title}
        inputMode={type === InputType.Number ? "numeric" : "text"}
        className={style}
        {...registerAttributes}
      />
    );
}
