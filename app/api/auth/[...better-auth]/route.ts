import { auth } from "@/app/_lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: Request) {
  return await auth.handler(req);
}

export async function POST(req: Request) {
  return await auth.handler(req);
}
