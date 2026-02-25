import { Suspense } from "react";
import ModDashboard from "@/app/_components/ModDashboard";
import LoaderMedium from "@/app/_components/LoaderMedium";

export const metadata = {
  title: "Moderator Dashboard",
};

export default function ModOverviewPage() {
  return (
    <div className="w-3/5 mx-auto mt-2">
      <h2 className="my-4 text-center text-2xl">Moderator dashboard</h2>
      <Suspense fallback={<LoaderMedium />}>
        <ModDashboard />
      </Suspense>
    </div>
  );
}
