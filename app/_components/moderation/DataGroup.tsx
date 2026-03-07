import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function DataGroup({
  header,
  className,
  children,
}: Readonly<{
  header: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col gap-2 h-full p-1 border-2 rounded-md border-cyan-700",
          className,
        ),
      )}
    >
      <div className="border-2 rounded-md text-xl text-center tracking-widest border-cyan-700 bg-slate-700">
        {header}
      </div>

      <div className="min-h-0 flex-1 max-h-full">{children}</div>
    </div>
  );
}
