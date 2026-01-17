import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function FormHint({
  className,
  children,
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  return (
    <div
      className={twMerge(
        clsx(
          "flex flex-col text-sm space-y-6 bg-gray-800 border-2 rounded-md leading-4 border-cyan-900 mx-2 my-4 px-3 py-2",
          className,
        ),
      )}
    >
      {children}
    </div>
  );
}

function Field({
  name,
  className,
  children,
}: Readonly<{
  name: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <p>
      <strong className="text-base text-gray-300">{name}: </strong>
      <span className={className}>{children}</span>
    </p>
  );
}

function Highlight({
  className,
  children,
}: Readonly<{ className: string; children: React.ReactNode }>) {
  return (
    <em className={twMerge(clsx("text-emerald-500", className))}>{children}</em>
  );
}

FormHint.Field = Field;
FormHint.Highlight = Highlight;

export default FormHint;
