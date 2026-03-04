import Image from "next/image";
import UserDataView from "@/app/_components/moderation/UserDataView";
import BackButton from "@/app/_components/primitives/BackButton";
import { getUserDataById } from "@/app/_lib/data/user-service";
import { ACTIVITY_PAGE_KEY } from "@/app/_utils/constants";

export default async function UserDataPage({
  params,
}: Readonly<{
  params: Promise<{ userId: string }>;
}>) {
  const { userId } = await params;
  const user = await getUserDataById(userId);

  return (
    <div className="mx-auto mt-4 w-7/10">
      <div className="flex gap-2 mx-auto mb-8 w-fit items-center">
        {user && (
          <Image
            className="inline border-2 rounded-full border-cyan-600"
            src={user.image ?? "/imgs/user.png"}
            alt={`Picture of ${user.name}`}
            width={50}
            height={50}
          />
        )}
        <h2 className="text-2xl tracking-wider text-center">
          {user ? user!.name : "User data"}
        </h2>
      </div>
      <BackButton
        href="/mod/users"
        ignoreParams={[ACTIVITY_PAGE_KEY]}
        restoreParams
      />
      <div className="border-2 rounded-lg border-cyan-700 bg-gray-600 text-cyan-100">
        {user ? (
          <UserDataView user={user} />
        ) : (
          <div className="my-1 text-center">
            The requested user cannot be found
          </div>
        )}
      </div>
    </div>
  );
}
