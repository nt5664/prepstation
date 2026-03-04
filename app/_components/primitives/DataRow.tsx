import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function DataRow({
  className,
  name,
  value,
}: Readonly<{
  className?: string;
  name: string;
  value: string | number | null;
}>) {
  return (
    <div
      className={twMerge(
        clsx("flex justify-between gap-2 text-gray-100", className),
      )}
    >
      <div className="font-semibold text-lg">{name}</div>
      <div className="italic">{value ?? "<NULL>"}</div>
    </div>
  );
}
