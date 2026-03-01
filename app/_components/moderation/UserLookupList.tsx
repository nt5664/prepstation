import { getUsersBySearchString } from "@/app/_lib/data/user-service";
import { getServerSession } from "@/app/_lib/auth";
import UserRow from "@/app/_components/moderation/UserRow";

export default async function UserLookupList({
  search,
}: Readonly<{ search: string | null }>) {
  if (!search || search.length < 2)
    return <div className="text-center">Enter at least 3 letters</div>;

  const [session, foundUsers] = await Promise.all([
    getServerSession(),
    getUsersBySearchString(search),
  ]);

  return (
    <div className="flex flex-col gap-2 items-center">
      {foundUsers.map((x) => (
        <UserRow key={x.id} data={x} isSelf={session!.user.id === x.id} />
      ))}
    </div>
  );
}
