import Navbar from "./Navbar";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="border-b-2 border-b-slate-600 bg-linear-to-b from-teal-600 to-cyan-800 h-12 text-teal-50">
      <div className="flex justify-between items-center mx-2 h-full">
        <div className="flex content-center">
          <Logo />
          <p className="inline-block cursor-default self-baseline text-xs font-semibold px-1 mx-1 mt-1 rounded-sm border-2 border-gray-800 bg-blue-500 text-gray-200">
            BETA
          </p>
        </div>
        <Navbar />
      </div>
    </header>
  );
}
