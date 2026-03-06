"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  banFormFields,
  banFormSchema,
  BanFormSchema,
} from "@/app/_utils/form-schemas/ban-schema";
import FormRow from "@/app/_components/forms/FormRow";
import InputLengthCounter from "@/app/_components/forms/InputLengthCounter";
import Input, { InputType } from "@/app/_components/forms/Input";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";
import { banUser } from "@/app/_lib/actions";

export default function UserBanForm({
  userId,
  onSubmitted,
}: Readonly<{ userId: string; onSubmitted: () => void }>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<BanFormSchema>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { reason: "" },
    resolver: zodResolver(banFormSchema),
  });

  function onSubmit(data: BanFormSchema) {
    toast.promise(() => banUser(data, userId), {
      loading: "Banning user...",
      success: () => {
        onSubmitted?.();
        return "User has been banned";
      },
      error: (err) => `Could not ban user: ${err}`,
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        id={banFormFields.reason.id}
        label="Ban reason"
        errorMessage={String(errors.reason?.message ?? "")}
        headerComponent={
          <InputLengthCounter
            control={control}
            name={banFormFields.reason.id}
            maxLength={banFormFields.reason.maxLength!}
          />
        }
      >
        <Input
          id={banFormFields.reason.id}
          type={InputType.LongText}
          placeholder="Description of the issue"
          hasError={errors.reason?.message !== undefined}
          registerAttributes={register(banFormFields.reason.id)}
        />
      </FormRow>

      <FormSubmitButton
        className="bg-rose-400 hover:bg-rose-300 active:bg-rose-500"
        disabled={!isValid}
      >
        Ban user
      </FormSubmitButton>
    </form>
  );
}
