import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export default function DisplayGrid({
  columnDefinition,
  className,
  renderHeader,
  renderRows,
}: Readonly<{
  columnDefinition: string;
  className?: string;
  renderHeader?: () => React.ReactNode;
  renderRows: () => React.ReactNode;
}>) {
  return (
    <div
      className={twMerge(clsx("grid gap-x-2 gap-y-1.5 w-full", className))}
      style={{ gridTemplateColumns: columnDefinition }}
    >
      {renderHeader && renderHeader()}
      {renderRows()}
    </div>
  );
}
