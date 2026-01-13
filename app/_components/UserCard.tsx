import Image from "next/image";
import { getServerSession } from "@/app/_lib/auth";

export default async function UserCard() {
  const session = await getServerSession();

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
        <svg
          className="inline-block stroke-emerald-700 fill-emerald-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={28}
          height={28}
        >
          <title>sword</title>
          <path d="M6.92,5H5L14,14L15,13.06M19.96,19.12L19.12,19.96C18.73,20.35 18.1,20.35 17.71,19.96L14.59,16.84L11.91,19.5L10.5,18.09L11.92,16.67L3,7.75V3H7.75L16.67,11.92L18.09,10.5L19.5,11.91L16.83,14.58L19.95,17.7C20.35,18.1 20.35,18.73 19.96,19.12Z" />
        </svg>

        <span>{session!.user.role}</span>
      </div>
    </div>
  );
}
