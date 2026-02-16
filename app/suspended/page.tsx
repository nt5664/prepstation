import { getServerSession } from "@/app/_lib/auth";
import { notFound } from "next/navigation";

export default async function SuspendedPage() {
  const session = await getServerSession();

  if (!session || session!.user.status !== "SUSPENDED") return notFound();

  return (
    <div className="flex flex-col gap-6 mx-auto mt-10 text-center text-2xl">
      <h1>
        Your account has been suspended, therefore cannot create or manage
        events anymore.
      </h1>
      <p>
        <strong>Reason: </strong>
        {session!.user.modNote}
      </p>
    </div>
  );
}
