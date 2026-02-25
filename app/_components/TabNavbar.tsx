"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function TabNavbar({
  tabs,
  className,
  tabsClassname,
  activeClassname,
}: Readonly<{
  tabs: { display: string; href: string }[];
  className?: string;
  tabsClassname?: string;
  activeClassname?: string;
}>) {
  const path = usePathname();

  function isActive(expPath: string) {
    return path === expPath || path === `${expPath}/`;
  }

  return (
    <ul
      className={twMerge(
        clsx(
          "grid gap-4 px-4 py-2 border-b-2 text-center border-b-slate-600 bg-linear-to-b from-slate-700 to-slate-900",
          className,
        ),
      )}
      style={{
        gridTemplateColumns: `repeat(${tabs.length},minmax(0,1fr))`,
      }}
    >
      {tabs.map((x) => (
        <li
          key={x.href}
          className={twMerge(
            clsx(tabsClassname, isActive(x.href) ? `${activeClassname}` : ""),
          )}
        >
          <Link href={x.href}>{x.display}</Link>
        </li>
      ))}
    </ul>
  );
}
