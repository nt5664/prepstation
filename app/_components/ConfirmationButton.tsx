"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Button, { ButtonType } from "@/app/_components/primitives/Button";

type Action0<TRet> = { type: "no-arg"; fn: () => Promise<TRet> };
type Action1<TArg, TRet> = {
  type: "arg";
  fn: (a: TArg) => Promise<TRet>;
  arg: TArg;
};
type ActionFn<TArg, TRet> = Action0<TRet> | Action1<TArg, TRet>;

export default function ConfirmationButton<TArg, TRet>({
  action,
  successHandling,
  messages = {
    question: "Are you sure?",
    pending: "Loading...",
    success: "The operation has been completed successfully",
    error: "The operation could not finish",
  },
  buttonLabels = { yes: "Yes", no: "No" },
  children,
}: Readonly<{
  action: ActionFn<TArg, TRet>;
  successHandling:
    | { action: "redirect"; to: string }
    | { action: "refresh" | "none" };
  messages?: {
    question?: React.ReactNode;
    pending?: string;
    success?: string;
    error?: string;
  };
  buttonLabels?: { yes: string; no: string };
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button
      type={ButtonType.Borderless}
      title="Delete event"
      className="bg-transparent hover:bg-transparent active:bg-transparent text-teal-500 hover:text-teal-400 active:text-teal-600"
      onClick={() => {
        if (isOpen) return;

        setIsOpen(true);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "dialog-open" : "dialog-close"
              } px-4 py-2 border-2 rounded-md border-yellow-400 bg-yellow-800 max-w-md`}
            >
              <div className="flex gap-4">
                <ExclamationTriangleIcon
                  height={100}
                  className="stroke-yellow-400"
                />
                <div className="flex flex-col gap-1 font-2xl">
                  <p className="text-yellow-400">{messages.question}</p>
                  <div className="flex align-middle justify-end gap-2">
                    <Button
                      type={ButtonType.Primary}
                      className="bg-yellow-400 hover:bg-yellow-300 border-yellow-500 hover:border-yellow-400 text-yellow-800 active:bg-yellow-500 active:border-yellow-600"
                      onClick={() => {
                        setIsOpen(false);
                        toast.dismiss(t.id);
                        toast.promise(
                          action.type === "arg"
                            ? action.fn(action.arg)
                            : action.fn(),
                          {
                            loading: messages.pending as string,
                            success: () => {
                              switch (successHandling.action) {
                                case "redirect":
                                  router.push("/user/events");
                                  break;
                                case "refresh":
                                  router.refresh();
                                  break;
                                case "none":
                                default:
                                  break;
                              }

                              return messages.success as string;
                            },
                            error: (err) => `${messages.error}. Error: ${err}`,
                          },
                        );
                      }}
                    >
                      {buttonLabels?.yes}
                    </Button>
                    <Button
                      type={ButtonType.Secondary}
                      className="text-yellow-400 hover:text-yellow-300 border-yellow-400 hover:border-yellow-300 active:text-yellow-500 active:border-yellow-500"
                      onClick={() => {
                        setIsOpen(false);
                        toast.dismiss(t.id);
                      }}
                    >
                      {buttonLabels?.no}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ),
          { duration: Infinity },
        );
      }}
    >
      {children}
    </Button>
  );
}
