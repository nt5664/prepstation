"use client";

import clsx from "clsx";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import SwordIcon from "@/app/_components/primitives/SwordIcon";

export default function UserRow({
  data: { id, name, image, role, status },
  isSelf,
}: Readonly<{
  data: {
    id: string;
    name: string;
    image: string | null;
    role: string;
    status: string;
  };
  isSelf: boolean;
}>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleClick() {
    router.push(
      `/mod/users/${id}${searchParams.size ? `?${searchParams.toString()}` : ""}`,
    );
  }

  return (
    <Button
      className={clsx(
        "grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2 px-2 py-1 w-full border-2 rounded-md text-left bg-slate-500 hover:bg-slate-400 active:bg-slate-600",
        isSelf ? "border-lime-500" : "border-cyan-500",
      )}
      type={ButtonType.Borderless}
      onClick={handleClick}
    >
      <Image
        className="col-1 row-span-full rounded-full"
        src={image ?? "/imgs/user.png"}
        alt={`Picture of ${name}`}
        height={50}
        width={50}
      />

      <div className="col-2 row-1 text-lg italic text-gray-100 align-text-bottom">
        {name}
        {role !== "USER" && (
          <SwordIcon
            className="ml-2 inline stroke-emerald-400 fill-transparent"
            height={24}
          />
        )}
      </div>
      <div
        className={clsx(
          "col-2 row-2 w-fit px-2 align-text-top text-sm font-semibold tracking-wide rounded-full",
          status === "ACTIVE"
            ? "bg-green-800 text-green-100"
            : "bg-rose-800 text-rose-100",
        )}
      >
        {status.toUpperCase()}
      </div>
    </Button>
  );
}
