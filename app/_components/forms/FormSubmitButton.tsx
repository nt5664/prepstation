"use client";

import Button, { ButtonType } from "@/app/_components/primitives/Button";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

export default function FormSubmitButton({
  className,
  disabled,
  children,
}: Readonly<{
  className?: string;
  disabled: boolean;
  children: React.ReactNode;
}>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={ButtonType.Primary}
      className={twMerge(clsx("mr-2", className))}
      disabled={pending || disabled}
    >
      {children}
    </Button>
  );
}
