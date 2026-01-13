"use client";

import { authClient } from "@/app/_lib/auth-client";

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
      <svg
        className="inline-block mr-2 fill-fuchsia-100 stroke-fuchsia-100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={20}
        height={20}
      >
        <path d="M11.64 5.93H13.07V10.21H11.64M15.57 5.93H17V10.21H15.57M7 2L3.43 5.57V18.43H7.71V22L11.29 18.43H14.14L20.57 12V2M19.14 11.29L16.29 14.14H13.43L10.93 16.64V14.14H7.71V3.43H19.14Z" />
      </svg>
      Log in
    </button>
  );
}
