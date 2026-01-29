"use client";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { Controller, useFormContext } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/24/outline";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import Input from "@/app/_components/forms/Input";
import { ExtraValue } from "@/app/_types/ExtraValue";
import DurationSelector from "@/app/_components/forms/DurationSelector";
import { ScheduleFormSchema } from "@/app/_utils/form-schemas/schedule-schema";

function ScheduleGrid({
  numExtraColumns,
  className,
  children,
}: Readonly<{
  numExtraColumns: number;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <div
      className={twMerge(
        clsx(
          `grid grid-cols-[auto_repeat(var(--col-count),minmax(0,1fr))_auto] gap-x-2 gap-y-1.5 w-full`,
          className,
        ),
      )}
      style={
        {
          "--col-count": String(numExtraColumns + 1),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

function Header({
  extraColumns,
}: Readonly<{ extraColumns: { key: string; name: string }[] }>) {
  const defaultColumns = ["Length", "Name"];
  return (
    <>
      {defaultColumns.map((x) => (
        <h3 key={x} className="font-semibold grid-1">
          {x}
        </h3>
      ))}
      {extraColumns.map((x) => (
        <div key={x.name}>
          <h3 className="font-semibold">{x.name}</h3>
          {x.key && <p className="text-xs italic">hidden</p>}
        </div>
      ))}
      <div></div>
    </>
  );
}

function FormRow({
  idx,
  extraValues,
  onRemove,
}: Readonly<{
  idx: number;
  extraValues: ExtraValue[];
  onRemove: () => void;
}>) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ScheduleFormSchema>();

  return (
    <>
      <div className="min-w-0">
        <Controller
          name={`matches.${idx}.estimate`}
          control={control}
          render={({ field, fieldState }) => {
            return (
              <div className="max-w-36">
                <DurationSelector
                  value={field.value}
                  title={fieldState.error?.message}
                  hasError={fieldState.error !== undefined}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </div>
            );
          }}
        />
      </div>

      <Input
        id={`matches.${idx}.name`}
        placeholder="Match name"
        title={errors.matches?.[idx]?.name?.message}
        hasError={errors.matches?.[idx]?.name?.message !== undefined}
        registerAttributes={register(`matches.${idx}.name`)}
      />

      {extraValues.map((x, i) => (
        <Input
          key={`matches.${idx}.${x.name}`}
          id={`matches.${idx}.${x.name}`}
          placeholder={x.name}
          title={errors.matches?.[idx]?.extraData?.[i]?.value?.message}
          hasError={
            errors.matches?.[idx]?.extraData?.[i]?.value?.message !== undefined
          }
          registerAttributes={register(`matches.${idx}.extraData.${i}.value`)}
        />
      ))}
      <Button
        type={ButtonType.Borderless}
        mode={ButtonMode.Button}
        title="Delete row"
        className="text-cyan-600 hover:text-cyan-400 active:text-cyan-700"
        onClick={onRemove}
      >
        <TrashIcon height={24} />
      </Button>
    </>
  );
}

ScheduleGrid.Header = Header;
ScheduleGrid.FormRow = FormRow;

export default ScheduleGrid;
