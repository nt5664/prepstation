"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import { changeUserRole } from "@/app/_lib/actions";

export default function UserRoleControls({
  id,
  isMod,
}: Readonly<{ id: string; isMod: boolean }>) {
  function handleClick(promote: boolean) {
    toast.promise(() => changeUserRole(id, promote), {
      loading: "Processing...",
      success: (res) =>
        `User role has been successfully changed to ${res.role}`,
      error: (err) => `Could not change user role: ${err}`,
    });
  }

  return (
    <div className="flex gap-1">
      <Button
        className="p-0.5 border-0 bg-violet-500 hover:bg-violet-400 active:bg-violet-600 disabled:bg-violet-800 disabled:cursor-not-allowed"
        disabled={isMod}
        title="Promote to moderator"
        type={ButtonType.Primary}
        onClick={() => handleClick(true)}
      >
        <ArrowUpIcon height={22} />
      </Button>

      <Button
        className="p-0.5 border-0 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed"
        disabled={!isMod}
        title="Demote to user"
        type={ButtonType.Primary}
        onClick={() => handleClick(false)}
      >
        <ArrowDownIcon height={22} />
      </Button>
    </div>
  );
}
