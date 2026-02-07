"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import toast from "react-hot-toast";

import {
  tableFormFields,
  tableFormSchema,
  TableFormSchema,
} from "@/app/_utils/form-schemas/table-schema";
import FormRow from "@/app/_components/forms/FormRow";
import InputLengthCounter from "@/app/_components/forms/InputLengthCounter";
import Input, { InputType } from "@/app/_components/forms/Input";
import ExtraColumnsEditor from "@/app/_components/forms/ExtraColumnsEditor";
import { ExtraColumnDefinition } from "@/app/_types/ExtraColumnDefinition";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import { saveTable } from "@/app/_lib/actions";

export default function TableEditorForm({
  eventName,
  tableToEdit,
}: Readonly<{
  eventName: string;
  tableToEdit?: {
    id: string;
    stub: string;
    title: string;
    startDate: Date;
    transitionTime: number;
    channel: string;
    website: string;
    extraColumns: ExtraColumnDefinition[];
  } | null;
}>) {
  const isEditing = !!tableToEdit;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<TableFormSchema>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      tableStub: isEditing ? tableToEdit!.stub : "",
      tableTitle: isEditing ? tableToEdit.title : "",
      startDate: format(
        isEditing ? tableToEdit!.startDate : new Date(),
        "yyyy-MM-dd'T'HH:mm",
      ),
      transitionTime: isEditing ? tableToEdit!.transitionTime : 10,
      channel: isEditing ? tableToEdit!.channel : "",
      website: isEditing ? tableToEdit!.website : "",
      extraColumns: isEditing ? tableToEdit!.extraColumns : [],
    },
    resolver: zodResolver(tableFormSchema),
  });

  function onSubmit(data: TableFormSchema) {
    toast.promise(saveTable(data, eventName, tableToEdit?.id), {
      loading: "Submitting...",
      success: (savedId) => {
        router.push(`/editor/${eventName}/${savedId}`);
        return `Table has been ${
          isEditing ? "updated" : "created"
        } successfully`;
      },
      error: (err) =>
        `Could not ${isEditing ? "update" : "create"} the event: ${err}`,
    });
  }

  function handleBack() {
    router.back();
  }
  console.log("errors", errors);
  return (
    <form className="m-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        id={tableFormFields.tableStub.id}
        label="Table stub"
        errorMessage={String(errors.tableStub?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={tableFormFields.tableStub.id}
            maxLength={tableFormFields.tableStub.maxLength!}
          />
        }
      >
        <Input
          id={tableFormFields.tableStub?.id}
          placeholder="exampleTable"
          hasError={errors.tableStub?.message !== undefined}
          registerAttributes={register(tableFormFields.tableStub.id)}
        />
      </FormRow>

      <FormRow
        id={tableFormFields.tableTitle.id}
        label="Display title"
        errorMessage={String(errors.tableTitle?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={tableFormFields.tableTitle.id}
            maxLength={tableFormFields.tableTitle.maxLength!}
          />
        }
      >
        <Input
          id={tableFormFields.tableTitle.id}
          placeholder="Example Table"
          hasError={errors.tableTitle?.message !== undefined}
          registerAttributes={register(tableFormFields.tableTitle.id)}
        />
      </FormRow>

      <FormRow
        id={tableFormFields.startDate.id}
        label="Start date"
        errorMessage={String(errors.startDate?.message ?? "")}
      >
        <Input
          id={tableFormFields.startDate.id}
          type={InputType.DateTime}
          hasError={errors.startDate?.message !== undefined}
          registerAttributes={register(tableFormFields.startDate.id, {
            setValueAs: (val) => new Date(val).toISOString(),
          })}
        />
      </FormRow>

      <FormRow
        id={tableFormFields.transitionTime.id}
        label="Transition length"
        errorMessage={String(errors.transitionTime?.message ?? "")}
      >
        <Input
          id={tableFormFields.transitionTime.id}
          type={InputType.Number}
          hasError={errors.transitionTime?.message !== undefined}
          registerAttributes={register(tableFormFields.transitionTime.id, {
            setValueAs: (val) => Number(val),
          })}
        />
      </FormRow>

      <FormRow
        id={tableFormFields.channel.id}
        label="Channel name"
        errorMessage={String(errors.channel?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={tableFormFields.channel.id}
            maxLength={tableFormFields.channel.maxLength!}
          />
        }
      >
        <Input
          id={tableFormFields.channel.id}
          hasError={errors.channel?.message !== undefined}
          registerAttributes={register(tableFormFields.channel.id)}
        />
      </FormRow>

      <FormRow
        id={tableFormFields.website.id}
        label="Website"
        errorMessage={String(errors.website?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={tableFormFields.website.id}
            maxLength={tableFormFields.website.maxLength!}
          />
        }
      >
        <Input
          id={tableFormFields.website.id}
          hasError={errors.website?.message !== undefined}
          registerAttributes={register(tableFormFields.website.id)}
        />
      </FormRow>

      <FormRow
        label="Extra columns"
        errorMessage={String(errors.extraColumns?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={tableFormFields.extraColumns.id}
            maxLength={tableFormFields.extraColumns.maxLength!}
          />
        }
      >
        <Controller
          name={tableFormFields.extraColumns.id}
          control={control}
          render={({ field }) => {
            function handleUpdate(values: ExtraColumnDefinition[]) {
              field.onChange(values);
            }

            return (
              <ExtraColumnsEditor
                value={field.value}
                max={tableFormFields.extraColumns.maxLength}
                onUpdate={handleUpdate}
                onBlur={field.onBlur}
              />
            );
          }}
        />
      </FormRow>
      <FormSubmitButton disabled={!isValid}>
        {isEditing ? "Save changes" : "Create"}
      </FormSubmitButton>
      <Button
        type={ButtonType.Secondary}
        mode={ButtonMode.Reset}
        onClick={handleBack}
      >
        Go back
      </Button>
    </form>
  );
}
