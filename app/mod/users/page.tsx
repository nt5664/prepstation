import { Suspense } from "react";
import InputFilter from "@/app/_components/InputFilter";
import LoaderMedium from "@/app/_components/LoaderMedium";
import UserLookupList from "@/app/_components/moderation/UserLookupList";

export default async function ModUsersPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ name?: string }> }>) {
  const { name } = await searchParams;

  return (
    <div className="flex flex-col mx-auto my-8 w-3/5">
      <h2 className="mb-4 text-center text-2xl">User lookup</h2>
      <div className="grid grid-cols-[auto_1fr] gap-2 justify-stretch items-center">
        <div>Enter a name to search:</div>
        <InputFilter filterKey="name" maxLength={25} value={name} />
      </div>

      <div className="my-8 px-4 py-2 border-2 rounded-md border-cyan-700 bg-gray-600">
        <Suspense key={name} fallback={<LoaderMedium />}>
          <UserLookupList search={name ?? null} />
        </Suspense>
      </div>
    </div>
  );
}
