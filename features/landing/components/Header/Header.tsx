import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { DesktopLogo } from "./DesktopLogo";
import { MobileLogo } from "./MobileLogo";

export const Header = () => {
  return (
    <header className="top-0 z-20 absolute flex justify-center md:justify-between items-center px-4 sm:px-6 lg:px-12 py-3 sm:py-4 w-full">
      <div className="hidden md:block">
        <DesktopLogo />
      </div>
      <div className="md:hidden">
        <MobileLogo />
      </div>
      <nav className="hidden md:flex gap-2 sm:gap-4">
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
