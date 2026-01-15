"use client";

import { authClient } from "@/app/_lib/auth-client";
import TwitchIcon from "@/app/_components/primitives/TwitchIcon";

export default function LoginButton() {
  async function login() {
    await authClient.signIn.social({
      provider: "twitch",
      callbackURL: "/user",
      errorCallbackURL: "/",
    });
  }

  return (
    <button
      className="px-2 py-0.5 rounded-md border-2 font-semibold border-fuchsia-100 bg-fuchsia-800 text-fuchsia-100 cursor-pointer hover:bg-fuchsia-700 active:bg-fuchsia-900"
      onClick={login}
    >
      <TwitchIcon
        className="inline-block mr-2 fill-fuchsia-100 stroke-fuchsia-100"
        width={20}
        height={20}
      />
      Log in
    </button>
  );
}
