import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";

export const config = {
  matcher: ["/editor/:path", "/user", "/user/:path"],
};

export async function proxy(req: Request) {
  const session = await auth.api.getSession({
    headers: Object.fromEntries(req.headers),
  });

  if (!session) return NextResponse.redirect(new URL("/", req.url));

  return NextResponse.next();
}
