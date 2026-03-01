import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type WarningBoxColors = "yellow" | "red";

export default function WarningBox({
  className,
  header,
  message,
  color = "yellow",
}: Readonly<{
  className?: string;
  header: string;
  message: string;
  color?: WarningBoxColors;
}>) {
  return (
    <div
      className={twMerge(
        clsx(
          "grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2 mx-auto py-1 px-2 w-fit h-fit border-3 rounded-md font-semibold",
          getColors(color),
          className,
        ),
      )}
    >
      <ExclamationTriangleIcon
        className="my-auto col-1 row-span-full"
        height={60}
      />

      <h6 className="col-2 row-1 text-xl tracking-wider">{header}</h6>
      <p className="col-2 row-2 italic">{message}</p>
    </div>
  );
}

function getColors(color: WarningBoxColors) {
  switch (color) {
    case "yellow":
      return "border-yellow-500 text-yellow-500 bg-yellow-800";
    case "red":
      return "border-red-500 text-red-500 bg-red-900";
  }
}
