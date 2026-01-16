"use client";

import { useRouter } from "next/navigation";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import { authClient } from "@/app/_lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.refresh() },
    });
  }

  return (
    <Button
      type={ButtonType.Borderless}
      className="bg-transparent hover:bg-transparent"
      onClick={logout}
    >
      Logout
    </Button>
  );
}
