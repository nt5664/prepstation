import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mt-16 mx-32">
      <h1 className="my-3 text-2xl tracking-wider text-center text-emerald-600 self-center">
        Welcome to PrepStation
      </h1>

      <p className="mt-8 text-center">
        PrepStation is a free, open-source scheduling tool optimized for online
        speedrunning marathons and tournaments, but it is still WIP even though
        it is in a usable state now.
      </p>
      <p className="text-center">
        If you find an issue, please report it on the app&apos;s{" "}
        <Link
          className="text-emerald-400 hover:text-emerald-300"
          href={"https://github.com/nt5664/prepstation/issues"}
          target="_blank"
        >
          GitHub repo
        </Link>
        .
      </p>
    </div>
  );
}
