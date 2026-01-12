import { auth } from "@/app/_lib/auth";

export async function GET(req: Request) {
  return await auth.handler(req);
}

export async function POST(req: Request) {
  return await auth.handler(req);
}
