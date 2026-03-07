import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import FormRow from "@/app/_components/forms/FormRow";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";
import Input, { InputType } from "@/app/_components/forms/Input";
import InputLengthCounter from "@/app/_components/forms/InputLengthCounter";
import {
  suspendFormFields,
  suspendFormSchema,
  SuspendFormSchema,
} from "@/app/_utils/form-schemas/event-suspend-schema";
import { suspendEvent } from "@/app/_lib/actions";

export default function EventSuspensionForm({
  eventId,
  onSubmitted,
}: Readonly<{ eventId: string; onSubmitted: () => void }>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<SuspendFormSchema>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { reason: "" },
    resolver: zodResolver(suspendFormSchema),
  });

  function onSubmit(data: SuspendFormSchema) {
    toast.promise(() => suspendEvent(data, eventId), {
      loading: "Suspending event...",
      success: () => {
        onSubmitted?.();
        return "Event has been suspended";
      },
      error: (err) => `Could not suspend event: ${err}`,
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        id={suspendFormFields.reason.id}
        label="Suspension reason"
        errorMessage={String(errors.reason?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={suspendFormFields.reason.id}
            maxLength={suspendFormFields.reason.maxLength!}
          />
        }
      >
        <Input
          id={suspendFormFields.reason.id}
          type={InputType.LongText}
          placeholder="Reason of the suspension"
          hasError={errors.reason?.message !== undefined}
          registerAttributes={register(suspendFormFields.reason.id)}
        />
      </FormRow>

      <FormSubmitButton
        className="bg-rose-400 hover:bg-rose-300 active:bg-rose-500"
        disabled={!isValid}
      >
        Suspend event
      </FormSubmitButton>
    </form>
  );
}
