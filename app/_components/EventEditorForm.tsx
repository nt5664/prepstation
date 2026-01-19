"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import InputLengthCounter from "@/app/_components/forms/InputLengthCounter";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import FormRow from "@/app/_components/forms/FormRow";
import Input, { InputType } from "@/app/_components/forms/Input";
import {
  eventFormFields,
  eventFormSchema,
  EventFormSchema,
} from "@/app/_utils/form-schemas/event-schema";
import { saveEvent } from "@/app/_lib/actions";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";

export default function EventEditorForm({
  eventToEdit,
}: Readonly<{
  eventToEdit?: {
    id: string;
    name: string;
    title: string;
    description: string;
  } | null;
}>) {
  const isEditing = !!eventToEdit;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<EventFormSchema>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      eventName: isEditing ? eventToEdit!.name : "",
      eventTitle: isEditing ? eventToEdit!.title : "",
      description: isEditing ? eventToEdit!.description : "",
    },
    resolver: zodResolver(eventFormSchema),
  });

  function onSubmit(data: EventFormSchema) {
    toast.promise(saveEvent(data, eventToEdit?.id), {
      loading: "Submitting...",
      success: (savedId) => {
        router.push(`/events/${savedId}`);
        return `Event has been ${
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

  return (
    <form className="m-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        id={eventFormFields.eventName.id}
        label="Event name"
        errorMessage={String(errors.eventName?.message ?? "")}
        headerComponent={
          <InputLengthCounter<EventFormSchema>
            control={control}
            name={eventFormFields.eventName.id}
            maxLength={eventFormFields.eventName.maxLength!}
          />
        }
      >
        <Input
          id={eventFormFields.eventName.id}
          placeholder="exampleEvent-01"
          hasError={errors.eventName?.message !== undefined}
          registerAttributes={register(eventFormFields.eventName.id)}
        />
      </FormRow>

      <FormRow
        id={eventFormFields.eventTitle.id}
        label="Display title"
        errorMessage={String(errors.eventTitle?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={eventFormFields.eventTitle.id}
            maxLength={eventFormFields.eventTitle.maxLength!}
          />
        }
      >
        <Input
          id={eventFormFields.eventTitle.id}
          placeholder="Example Event 01"
          hasError={errors.eventTitle?.message !== undefined}
          registerAttributes={register(eventFormFields.eventTitle.id)}
        />
      </FormRow>

      <FormRow
        id={eventFormFields.description.id}
        label="Description"
        errorMessage={String(errors.description?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={eventFormFields.description.id}
            maxLength={eventFormFields.description.maxLength!}
          />
        }
      >
        <Input
          type={InputType.LongText}
          id={eventFormFields.description.id}
          className="w-full px-1 py-0.5 border-2 rounded-sm placeholder-gray-400 bg-gray-700 border-cyan-700 focus:border-cyan-500 focus:text-cyan-500 focus:outline-0"
          registerAttributes={register(eventFormFields.description.id)}
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
