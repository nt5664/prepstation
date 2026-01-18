import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import { revalidatePath } from "next/cache";

export const config = {
  matcher: ["/editor/:path*", "/user/:path*", "/mod/:path*"],
};

export async function proxy(req: Request) {
  const session = await auth.api.getSession({
    headers: Object.fromEntries(req.headers),
  });

  if (!session) {
    revalidatePath("/");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
