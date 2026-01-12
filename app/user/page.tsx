import Image from "next/image";
import { getServerSession } from "@/app/_lib/auth";

export default async function UserPage() {
  const session = await getServerSession();

  return (
    <div>
      <div className="grid grid-cols-[100px_1fr] grid-rows-2">
        <Image
          className="col-1 row-span-full"
          src={session?.user?.image ?? "/imgs/user.png"}
          alt="User's profile picture"
          width={100}
          height={100}
        />
        <h3 className="col-2 row-1">{session?.user.name}</h3>
        <p className="col-2 row-2">{session?.user.role}</p>
      </div>
    </div>
  );
}
