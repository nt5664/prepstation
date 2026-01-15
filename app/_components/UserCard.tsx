import Image from "next/image";
import { getServerSession } from "@/app/_lib/auth";
import SwordIcon from "@/app/_components/primitives/SwordIcon";
import { isSuperuser } from "@/app/_utils/user";

export default async function UserCard() {
  const session = await getServerSession();
  const superuser = isSuperuser(session!.user);

  return (
    <div className="grid grid-cols-[75px_1fr] m-2 px-4 py-2 grid-rows-2 border-2 rounded-md border-cyan-900 bg-gray-600">
      <Image
        className="col-1 row-span-full rounded-full"
        src={session!.user.image ?? "/imgs/user.png"}
        alt="User's profile picture"
        width={75}
        height={75}
      />
      <h3 className="col-2 row-1 ml-2 self-end text-2xl tracking-wide font-semibold italic">
        {session!.user.name}
      </h3>
      <div className="col-2 row-2 ml-2 flex text-xl font-light">
        {superuser && (
          <SwordIcon
            className="inline-block stroke-emerald-700 fill-emerald-500"
            width={28}
            height={28}
          />
        )}

        <span>{session!.user.role}</span>
      </div>
    </div>
  );
}
