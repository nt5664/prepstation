import { UseFormRegisterReturn } from "react-hook-form";

export enum InputType {
  Text = "text",
  LongText = "textarea",
  Number = "number",
}

export default function Input({
  type = InputType.Text,
  id,
  placeholder,
  hasError = false,
  className,
  registerAttributes,
}: Readonly<{
  type?: InputType;
  id: string;
  placeholder?: string;
  hasError?: boolean;
  className?: string;
  registerAttributes: UseFormRegisterReturn;
}>) {
  const style = `w-full px-1 py-0.5 border-2 rounded-sm font-medium placeholder-gray-400 text-gray-300 bg-gray-700 ${
    hasError ? "border-rose-400" : "border-cyan-700"
  } focus:border-cyan-500 focus:text-cyan-300 focus:outline-0 placeholder:font-normal placeholder:italic ${className}`;

  if (type === InputType.LongText)
    return (
      <textarea
        id={id}
        placeholder={placeholder}
        className={style}
        {...registerAttributes}
      />
    );
  else
    return (
      <input
        id={id}
        type={type.toString()}
        placeholder={placeholder}
        className={style}
        {...registerAttributes}
      />
    );
}
