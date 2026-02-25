import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DashboardCard({
  title,
  href,
  children,
}: Readonly<{ title: string; href?: string; children: React.ReactNode }>) {
  return (
    <div className="grid grid-rows-[auto_1fr] h-fit border-3 rounded-md border-gray-500 bg-gray-700">
      <div className="flex justify-between items-center px-1 pb-1 bg-gray-500 text-gray-100">
        <h6 className="truncate text-lg font-semibold">{title}</h6>
        {href && (
          <Link href={href}>
            <ArrowRightIcon className="stroke-2" height={20} />
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}
