import { notFound } from "next/navigation";
import { doesAdminExist } from "@/app/_lib/data/user-service";
import { getServerSession } from "@/app/_lib/auth";
import PromoteForm from "@/app/_components/PromoteForm";

export default async function PromotePage() {
  const [hasAdmin, session] = await Promise.all([
    doesAdminExist(),
    getServerSession(),
  ]);
  if (!session || hasAdmin) return notFound();

  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr]">
      <div className="row-2 col-2 px-2 py-1 border-2 rounded-lg border-cyan-700 bg-slate-700">
        <PromoteForm />
      </div>
    </div>
  );
}
