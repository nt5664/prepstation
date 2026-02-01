import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  noStore();

  return <>{children}</>;
}
