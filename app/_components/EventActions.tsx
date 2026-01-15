"use client";

import {
  FlagIcon,
  FolderPlusIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import Separator from "@/app/_components/primitives/Separator";
import toast, { ToastBar } from "react-hot-toast";

export default function EventActions() {
  return (
    <div className="flex gap-4">
      <Button
        type={ButtonType.Borderless}
        title="Report event"
        className="bg-transparent hover:bg-transparent text-amber-500 hover:text-amber-400"
      >
        <FlagIcon height={24} />
      </Button>
      <Button
        type={ButtonType.Borderless}
        title="Moderate this event"
        className="bg-transparent hover:bg-transparent text-pink-500 hover:text-pink-400"
      >
        <ShieldCheckIcon type={ButtonType.Borderless} height={24} />
      </Button>

      <Separator width={2} height={24} />

      <div className="flex gap-1.5">
        <Button
          type={ButtonType.Borderless}
          title="Add table"
          className="bg-transparent hover:bg-transparent text-teal-500 hover:text-teal-400"
        >
          <FolderPlusIcon height={24} />
        </Button>
        <Button
          type={ButtonType.Borderless}
          title="Edit event details"
          className="bg-transparent hover:bg-transparent text-teal-500 hover:text-teal-400"
        >
          <PencilSquareIcon height={24} />
        </Button>
        <Button
          type={ButtonType.Borderless}
          title="Delete event"
          className="bg-transparent hover:bg-transparent text-teal-500 hover:text-teal-400"
          onClick={() =>
            toast.custom((t) => (
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <div className="flex gap-1.5 font-xl">
                    <p>
                      Are you sure you want to delete this event?{" "}
                      <strong>(this action cannot be undone!)</strong>
                    </p>
                  </div>
                )}
              </ToastBar>
            ))
          }
        >
          <TrashIcon height={24} />
        </Button>
      </div>
    </div>
  );
}
