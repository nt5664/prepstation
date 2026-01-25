"use client";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import SecondaryInput from "@/app/_components/forms/SecondaryInput";

export default function ExtraColumnsEditor({
  value,
  max = 10,
  className,
  onUpdate,
}: Readonly<{
  value: ExtraColumnDefinition[];
  max?: number;
  className?: string;
  onUpdate: (values: ExtraColumnDefinition[]) => void;
}>) {
  function handleUpdate(
    id: string,
    newName: string | null,
    newKey?: string | null,
  ) {
    onUpdate(
      value.map((x) =>
        x.id === id
          ? { id: id, name: newName ?? x.name, key: newKey ?? x.key }
          : x,
      ),
    );
  }

  return (
    <div>
      <div
        className={twMerge(
          clsx(
            "flex flex-col space-y-2 w-full p-1 border-2 rounded-sm text-gray-300 bg-gray-700 border-cyan-700",
            className,
          ),
        )}
      >
        {value.length ? (
          <>
            <div className="grid grid-cols-[1fr_1.1fr] font-semibold">
              <h6 className="mx-0.5">Column name</h6>
              <h6 className="mx-0.5">Column secret</h6>
            </div>
            {value.map((x) => (
              <ExtraColumnsEditorRow
                key={x.id}
                id={x.id}
                column={x}
                onChange={handleUpdate}
                onRemove={() => onUpdate(value.filter((y) => y.id !== x.id))}
              />
            ))}
          </>
        ) : (
          <p className="text-center">No extra columns yet</p>
        )}
        <div className="self-end">
          <Button
            type={ButtonType.Secondary}
            mode={ButtonMode.Button}
            className="text-sm px-1 py-0.5 text-cyan-500 border-cyan-500 hover:text-cyan-400 hover:border-cyan-400 active:text-cyan-600 active:border-cyan-600"
            title="Add column"
            disabled={value.length >= max}
            onClick={() =>
              onUpdate([
                ...value,
                { id: crypto.randomUUID(), name: "custom column", key: "" },
              ])
            }
          >
            <PlusIcon height={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExtraColumnsEditorRow({
  id,
  column,
  onChange,
  onRemove,
}: Readonly<{
  id: string;
  column: ExtraColumnDefinition;
  onChange: (id: string, name: string | null, key: string | null) => void;
  onRemove: () => void;
}>) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-1">
      <SecondaryInput
        value={column.name}
        onChange={(e) => onChange(id, e.target.value, null)}
      />
      <SecondaryInput
        placeholder="No secret"
        value={column.key}
        onChange={(e) => onChange(id, null, e.target.value)}
      />
      <Button
        type={ButtonType.Borderless}
        mode={ButtonMode.Button}
        className="text-green-600 hover:text-green-400"
        title="Remove column"
        onClick={onRemove}
      >
        <TrashIcon height={24} />
      </Button>
    </div>
  );
}
