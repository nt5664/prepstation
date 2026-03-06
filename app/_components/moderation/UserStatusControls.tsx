"use client";

import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import Modal, { useCloseModalWindow } from "@/app/_components/Modal";
import UserBanForm from "@/app/_components/moderation/UserBanForm";
import { unbanUser } from "@/app/_lib/actions";

export default function UserStatusControls({
  id,
  isActive,
}: Readonly<{ id: string; isActive: boolean }>) {
  function handleUnban() {
    toast.promise(() => unbanUser(id), {
      loading: "Unbanning user...",
      success: "User has been unbanned",
      error: (err) => `Could not unban user: ${err}`,
    });
  }

  return (
    <div className="flex gap-1">
      {isActive && (
        <Modal mode="center-screen">
          <Modal.Toggle className="px-1 rounded-sm bg-red-700 text-gray-100 hover:bg-red-600 active:bg-red-800 disabled:bg-red-900">
            <div className="flex gap-1 p-0.5">
              <XCircleIcon className="self-center" height={20} />
              <div>Ban user</div>
            </div>
          </Modal.Toggle>

          <Modal.Window title="Ban user">
            <BanUserWindowContent id={id} />
          </Modal.Window>
        </Modal>
      )}

      <Button
        className="py-0 px-1 border-0 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed"
        disabled={isActive}
        type={ButtonType.Primary}
        onClick={handleUnban}
      >
        <div className="flex gap-1 p-0.5">
          <CheckCircleIcon className="self-center" height={20} />
          <div>Unban user</div>
        </div>
      </Button>
    </div>
  );
}

function BanUserWindowContent({ id }: Readonly<{ id: string }>) {
  const closeWindow = useCloseModalWindow();
  return (
    <div className="p-2 w-100 bg-gray-700">
      <UserBanForm userId={id} onSubmitted={closeWindow} />
    </div>
  );
}
