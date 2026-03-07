"use client";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Modal, { useCloseModalWindow } from "@/app/_components/Modal";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import { restoreEvent } from "@/app/_lib/actions";
import EventSuspensionForm from "@/app/_components/moderation/EventSuspensionForm";

export default function EventModActions({
  id,
  visibility,
}: Readonly<{ id: string; visibility: string }>) {
  const isActive = visibility === "ACTIVE";

  function handleRestore() {
    toast.promise(() => restoreEvent(id), {
      loading: "Restoring event...",
      success: "Event has been restored",
      error: (err) => `Could not restore event: ${err}`,
    });
  }

  return (
    <div className="flex gap-1 m-2 px-2 py-1 border-2 rounded-lg border-cyan-700">
      {isActive ? (
        <Modal mode="center-screen">
          <Modal.Toggle className="px-1 rounded-sm bg-red-700 text-gray-100 hover:bg-red-600 active:bg-red-800 disabled:bg-red-900">
            <div className="flex gap-1 p-0.5">
              <XCircleIcon className="self-center" height={20} />
              <div>Suspend event</div>
            </div>
          </Modal.Toggle>

          <Modal.Window title="Suspend event">
            <SuspendEventWindowContent id={id} />
          </Modal.Window>
        </Modal>
      ) : (
        <Button
          className="py-0 px-1 border-0 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed"
          type={ButtonType.Primary}
          onClick={handleRestore}
        >
          <div className="flex gap-1 p-0.5">
            <CheckCircleIcon className="self-center" height={20} />
            <div>Restore event</div>
          </div>
        </Button>
      )}
    </div>
  );
}

function SuspendEventWindowContent({ id }: Readonly<{ id: string }>) {
  const closeWindow = useCloseModalWindow();

  return (
    <div className="p-2 w-100 bg-gray-700">
      <EventSuspensionForm eventId={id} onSubmitted={closeWindow} />
    </div>
  );
}
