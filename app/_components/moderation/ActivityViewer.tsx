"use client";

import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ActivityData } from "@/app/_types/ActivityData";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import DataRow from "@/app/_components/primitives/DataRow";

export default function ActivityViewer({
  activityToShow,
  onClose,
}: Readonly<{ activityToShow: ActivityData | null; onClose: () => void }>) {
  return !activityToShow
    ? null
    : createPortal(
        <div className="grid grid-cols-[1fr_2fr_1fr] grid-rows-[1fr_3fr_1fr] absolute w-full h-full top-0 left-0 z-10 bg-[rgba(10,10,10,0.5)]">
          <div className="grid grid-rows-[auto_1fr] row-2 col-2 p-1.5 border-3 rounded-lg border-sky-600 bg-slate-600">
            <div className="flex justify-between">
              <h6 className="text-lg uppercase">
                {activityToShow.affects} &gt; {activityToShow.payload.action}
              </h6>
              <Button
                className="p-0"
                type={ButtonType.Primary}
                mode={ButtonMode.Button}
                title="Close window"
                onClick={onClose}
              >
                <XMarkIcon height={24} />
              </Button>
            </div>

            <div className="px-4 overflow-auto text-cyan-100">
              <div className="font-semibold">Data</div>
              <TreeLevel data={activityToShow.payload} />
            </div>
          </div>
        </div>,
        document.body,
      );
}

function TreeLevel({ data }: Readonly<{ data: object }>) {
  return (
    <div className="pl-4 border-l-2">
      {Object.entries(data)
        .sort()
        .map((x) =>
          typeof x[1] === "object" ? (
            <div key={x[0]}>
              <div className="text-lg font-semibold">{x[0]}</div>
              <TreeLevel data={x[1] as object} />
            </div>
          ) : (
            <DataRow
              className="text-cyan-100 hover:text-cyan-400"
              name={x[0]}
              value={x[1]}
            />
          ),
        )}
    </div>
  );
}
