"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SecondaryInput from "@/app/_components/forms/SecondaryInput";
import FormSubmitButton from "@/app/_components/forms/FormSubmitButton";
import { promoteSetup } from "@/app/_lib/actions";

export default function PromoteForm() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    toast.promise(() => promoteSetup(value), {
      loading: "Please wait...",
      success: () => {
        router.replace("/user");
        return "Success!";
      },
      error: "Failure!",
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <SecondaryInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FormSubmitButton className="mt-1 mx-auto py-0" disabled={!value}>
        Submit
      </FormSubmitButton>
    </form>
  );
}
