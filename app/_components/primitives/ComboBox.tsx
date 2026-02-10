import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type ComboBoxOption<T extends string> = {
  value: T;
  display: string;
};

export default function ComboBox<T extends string>({
  className,
  id,
  name,
  value,
  items,
  onChange,
}: Readonly<{
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  items: ComboBoxOption<T>[];
  onChange: ((value: T) => void) | ((value: T) => Promise<void>);
}>) {
  return (
    <select
      className={twMerge(clsx("mx-1 cursor-pointer outline-0", className))}
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {items.map((x) => (
        <option key={x.value} value={x.value}>
          {x.display}
        </option>
      ))}
    </select>
  );
}
