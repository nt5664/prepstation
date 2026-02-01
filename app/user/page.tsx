import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";
import ManagedEvents from "@/app/_components/ManagedEvents";
import UserCard from "@/app/_components/UserCard";
import LoaderSmall from "@/app/_components/LoaderMedium";

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

export default async function UserPage() {
  noStore();

  return (
    <div className="flex flex-col w-3/5 mx-auto mt-8 gap-2">
      <UserCard />

      <Suspense fallback={<LoaderSmall />}>
        <ManagedEvents />
      </Suspense>
    </div>
  );
}
