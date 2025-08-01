import Link from "next/link";
import Image from "next/image";

export const DesktopLogo = () => {
  return (
    <div className="flex justify-between items-center w-full">
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
    </div>
  );
};
