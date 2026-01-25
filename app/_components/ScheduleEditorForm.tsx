"use client";

import { useRouter } from "next/navigation";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addMinutes, format } from "date-fns";
import toast from "react-hot-toast";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import {
  scheduleFormSchema,
  ScheduleFormSchema,
} from "@/app/_utils/form-schemas/schedule-schema";
import ScheduleGrid from "@/app/_components/ScheduleGrid";
import { ExtraValue } from "@/app/_types/ExtraValue";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";
import { deleteScheduleEntry, saveSchedule } from "@/app/_lib/actions";

export default function ScheduleEditorForm({
  table: { id: tableId, startDate, transitionTime, extraColumns, entries },
  eventId,
  className,
}: Readonly<{
  table: {
    id: string;
    startDate: Date;
    transitionTime: number;
    extraColumns: ExtraColumnDefinition[];
    entries: {
      id: string;
      name: string;
      estimate: number;
      extraData: ExtraValue[];
    }[];
  };
  eventId: string;
  className?: string;
}>) {
  const router = useRouter();
  const formMethods = useForm<ScheduleFormSchema>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      matches:
        entries?.map((x) => ({
          ...x,
          extraData: x.extraData.filter((y) =>
            extraColumns.some((z) => z.name === y.name),
          ),
        })) ?? [],
    },
    resolver: zodResolver(scheduleFormSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = formMethods;
  const watch = useWatch({ control, name: "matches" });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "matches",
    keyName: "rhfKey",
  });

  function onSubmit(data: ScheduleFormSchema) {
    toast.promise(saveSchedule(data, eventId, tableId), {
      loading: "Submitting...",
      success: ({ eventName, tableStub }) => {
        router.push(`/events/${eventName}/${tableStub}`);
        return "The schedule has been saved successfully.";
      },
      error: (err) => `Could not save the schedule: ${err}`,
    });
  }

  function handleBack() {
    router.back();
  }

  return (
    <FormProvider {...formMethods}>
      <div className={className}>
        <p className="text-center">
          Starting{" "}
          <span className="italic">
            {format(startDate, "dd MMMM yyyy HH:mm")}
          </span>{" "}
          and ends{" "}
          <span className="italic">
            {format(
              addMinutes(
                startDate,
                watch.reduce((acc, curr) => acc + curr.estimate, 0) +
                  (fields.length > 1
                    ? (fields.length - 1) * transitionTime
                    : 0),
              ),
              "dd MMMM yyyy HH:mm",
            )}
          </span>
        </p>
        <div className="my-6 border-2 rounded-md border-cyan-800 bg-slate-800">
          <form className="m-4" noValidate onSubmit={handleSubmit(onSubmit)}>
            <ScheduleGrid numExtraColumns={extraColumns.length}>
              <ScheduleGrid.Header extraColumns={extraColumns} />

              {fields.map((x, i) => (
                <ScheduleGrid.FormRow
                  key={x.rhfKey}
                  idx={i}
                  extraValues={x.extraData}
                  onRemove={async () => {
                    if (
                      x.id &&
                      !(await deleteScheduleEntry(x.id, eventId, tableId))
                    ) {
                      toast.error("Could not remove the row.");
                      return;
                    }

                    remove(i);
                    toast.success("Row has been removed successfully.");
                  }}
                />
              ))}
            </ScheduleGrid>

            <div className="flex flex-col gap-2">
              <div>
                <Button
                  type={ButtonType.Borderless}
                  mode={ButtonMode.Button}
                  title="Add new"
                  className="border-2 rounded-sm text-cyan-600 border-cyan-600 hover:text-cyan-400 hover:border-cyan-400 active:text-cyan-700 active:border-cyan-700"
                  onClick={() =>
                    append({
                      id: null,
                      name: "",
                      estimate: 10,
                      extraData: extraColumns.map((x) => ({
                        name: x.name,
                        value: "",
                      })),
                    })
                  }
                >
                  <PlusIcon height={24} />
                </Button>
              </div>

              <div className="flex gap-1">
                <FormSubmitButton disabled={!isValid}>
                  Save changes
                </FormSubmitButton>
                <Button
                  type={ButtonType.Secondary}
                  mode={ButtonMode.Reset}
                  onClick={handleBack}
                >
                  Go back
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
