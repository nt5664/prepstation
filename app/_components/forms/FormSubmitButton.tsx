import Button, { ButtonType } from "@/app/_components/primitives/Button";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
  disabled,
  children,
}: Readonly<{ disabled: boolean; children: React.ReactNode }>) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={ButtonType.Primary}
      className="mr-2"
      disabled={pending || disabled}
    >
      {children}
    </Button>
  );
}
