import clsx from "clsx";
import { getServerSession } from "@/app/_lib/auth";
import { isSuperuser, isUserActive, isUserAdmin } from "@/app/_utils/user";
import UserRoleControls from "@/app/_components/moderation/UserRoleControls";
import UserStatusControls from "@/app/_components/moderation/UserStatusControls";

export default async function UserActions({
  user,
}: Readonly<{ user: { id: string; role: string; status: string } }>) {
  const session = await getServerSession();
  const isAdmin = isUserAdmin(session?.user);
  const isTargetAdmin = isUserAdmin(user);

  return isTargetAdmin ? null : (
    <div
      className={clsx(
        "flex justify-between gap-2 m-2 px-2 py-1 border-2 rounded-lg border-cyan-700",
        !isAdmin ? "w-fit" : "",
      )}
    >
      <UserStatusControls id={user.id} isActive={isUserActive(user)} />

      {isAdmin && <UserRoleControls id={user.id} isMod={isSuperuser(user)} />}
    </div>
  );
}
