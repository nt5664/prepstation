import clsx from "clsx";

type StatColoringMode = "default" | "neutral" | "inverse";

export default function StatRow({
  title,
  value,
  valueIfNan = "-",
  coloring = "default",
}: Readonly<{
  title: string;
  value: number;
  valueIfNan?: string;
  coloring?: StatColoringMode;
}>) {
  return (
    <div className="flex justify-between px-1">
      <div className="self-end text-sm">{title}</div>
      <div
        className={clsx(
          "text-4xl font-semibold",
          getCounterColor(value, coloring),
        )}
      >
        {Number.isNaN(value) ? valueIfNan : value}
      </div>
    </div>
  );
}

function getCounterColor(value: number, coloring: StatColoringMode) {
  const nan = Number.isNaN(value);
  switch (coloring) {
    case "neutral":
      return "text-amber-100";
    case "default":
      return !value || nan ? "text-emerald-400" : "text-rose-400";
    case "inverse":
      return !value || nan ? "text-rose-400" : "text-emerald-400";
  }
}
