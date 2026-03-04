import { notFound } from "next/navigation";
import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser } from "@/app/_utils/user";
import TabNavbar from "@/app/_components/TabNavbar";

const MOD_TABS = [
  { display: "Overview", href: "/mod" },
  { display: "Reports", href: "/mod/reports" },
  { display: "Events", href: "/mod/events" },
  { display: "Users", href: "/mod/users" },
];

export default async function ModLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!isSuperuser(session!.user)) return notFound();

  return (
    <div className="grid grid-rows-[auto_auto]">
      <TabNavbar
        tabs={MOD_TABS}
        tabsClassname="border-2 rounded-md border-transparent hover:text-cyan-300 hover:border-cyan-300"
        activeClassname="bg-cyan-600 font-bold"
      />

      {children}
    </div>
  );
}
