"use client";

import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@/app/_utils/form-schemas/event";
import { createEvent } from "@/app/_lib/actions";

export default function EventEditorForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<EventFormSchema>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      eventName: "",
      eventTitle: "",
      description: "",
    },
    resolver: zodResolver(eventFormSchema),
  });

  function onSubmit(data: EventFormSchema) {
    createEvent(data);
  }

  function handleBack() {
    router.back();
  }

  return (
    <form className="m-4" onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        id={eventFormFields.eventName.id}
        label="Event name"
        errorMessage={String(errors.eventName?.message ?? "")}
        headerComponent={
          <InputLengthCounter<EventFormSchema>
            control={control}
            name={eventFormFields.eventName.id}
            maxLength={eventFormFields.eventName.maxLength}
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
            maxLength={eventFormFields.eventTitle.maxLength}
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
            maxLength={eventFormFields.description.maxLength}
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

      <Button type={ButtonType.Primary} className="mr-2" disabled={!isValid}>
        Create
      </Button>
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
