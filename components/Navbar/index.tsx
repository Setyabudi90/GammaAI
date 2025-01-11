import { ThemeToggle } from "../ThemeToggle";
import { Atom } from "lucide-react";

export function Navbar() {
  return (
    <header className="md:w-[85%] w-screen md:z-40 sm:z-0 flex justify-center md:justify-between dark:bg-[#212121] fixed bg-slate-100 items-center py-3 px-5 z-30 border-none shadow-none">
      <div className="font-extrabold text-2xl dark:text-[#bfaca8] md:translate-x-0 flex items-center gap-2 translate-x-5 text-slate-900">
        Gamma <Atom />
      </div>
      <div className="relative top-0 md:right-10 -right-[6rem]">
        <ThemeToggle />
      </div>
    </header>
  );
}
