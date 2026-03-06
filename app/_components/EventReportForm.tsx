"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  reportFormFields,
  reportFormSchema,
  ReportFormSchema,
} from "@/app/_utils/form-schemas/report-schema";
import { sendReport } from "@/app/_lib/actions";
import FormRow from "@/app/_components/forms/FormRow";
import InputLengthCounter from "@/app/_components/forms/InputLengthCounter";
import Input, { InputType } from "@/app/_components/forms/Input";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";

export default function EventReportForm({
  eventId,
  onSubmitted,
}: Readonly<{ eventId: string; onSubmitted?: () => void }>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<ReportFormSchema>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { message: "" },
    resolver: zodResolver(reportFormSchema),
  });

  function onSubmit(data: ReportFormSchema) {
    toast.promise(sendReport(data, eventId), {
      loading: "Sending report...",
      success: () => {
        onSubmitted?.();
        return "Event report has been submitted";
      },
      error: (err) => `Could not send the report: ${err}`,
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        id={reportFormFields.message.id}
        label="Report message"
        errorMessage={String(errors.message?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={reportFormFields.message.id}
            maxLength={reportFormFields.message.maxLength!}
          />
        }
      >
        <Input
          id={reportFormFields.message.id}
          type={InputType.LongText}
          placeholder="Description of the issue"
          hasError={errors.message?.message !== undefined}
          registerAttributes={register(reportFormFields.message.id)}
        />
      </FormRow>

      <FormSubmitButton disabled={!isValid}>Send report</FormSubmitButton>
    </form>
  );
}
