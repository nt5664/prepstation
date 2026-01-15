import { Genos } from "next/font/google";
import Navbar from "./Navbar";
import Link from "next/link";
import Logo from "./Logo";

const genos = Genos({
  subsets: ["latin"],
});

export default function Header() {
  return (
    <header className="border-b-2 border-gray-700 bg-linear-to-b from-teal-600 to-teal-800 h-12 text-teal-50">
      <div className="flex justify-between items-center mx-2 h-full">
        <div className="flex content-center">
          {/* <Link href="/" className={`font-bold ${genos.className} text-3xl`}>
            PrepStation
          </Link> */}
          <Logo />
          <p className="inline-block cursor-default self-baseline text-xs font-semibold px-1 mx-1 mt-1 rounded-sm border-2 border-gray-800 bg-orange-500 text-gray-800">
            ALPHA
          </p>
        </div>
        <Navbar />
      </div>
    </header>
  );
}
