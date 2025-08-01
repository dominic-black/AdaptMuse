import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const Header = () => {
  return (
    <header className="top-0 z-20 absolute flex justify-between items-center px-4 sm:px-6 lg:px-12 py-3 sm:py-4 w-full">
      <Link href="/" className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={32}
          height={32}
          className="sm:w-10 sm:h-10"
        />
        <span className="bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-400 to-green-400 font-extrabold text-transparent text-lg sm:text-xl tracking-tight filter">
          AdaptMuse
        </span>
      </Link>
      <nav className="flex gap-2 sm:gap-4">
        <Button
          variant="ghost"
          href="/login"
          className="px-3 sm:px-4 text-[var(--color-text)] text-sm sm:text-base"
        >
          Login
        </Button>
        <Button
          variant="primary"
          href="/signup"
          className="px-3 sm:px-4 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Sign Up</span>
          <span className="sm:hidden">Sign Up</span>
          <ArrowRight className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4" />
        </Button>
      </nav>
    </header>
  );
};
