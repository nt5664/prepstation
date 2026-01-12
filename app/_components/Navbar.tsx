import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getServerSession } from "@/app/_lib/auth";
import LoginButton from "./primitives/LoginButton";

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="z-10 h-8">
      {session ? (
        <ul className="flex gap-8 items-center h-full">
          <li>
            <Link
              href="/editor/event"
              className="px-2 py-1 rounded-md bg-teal-100 hover:bg-teal-50 border-[1] border-teal-800 text-teal-800"
            >
              <PlusIcon
                className="inline-block size-4 align-middle mb-0.75 mr-0.5"
                strokeWidth={2.5}
              />
              Create New
            </Link>
          </li>
          <li>
            <Link href="/">My Events</Link>
          </li>
          <li>
            <Link href="/">Profile</Link>
          </li>
          <li>
            <Link href="/">Logout</Link>
          </li>
        </ul>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
}
