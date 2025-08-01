import Link from "next/link";
import Image from "next/image";

export const MobileLogo = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex justify-center items-center mt-6 w-full">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 bg-white/60 shadow-xl backdrop-blur-lg px-4 py-3 border border-white/50 rounded-xl"
        >
          <div className="">
            <Image src="/logo.png" alt="logo" width={60} height={60} />
          </div>
          <span className="bg-clip-text bg-gradient-to-br from-[#00B4D8] via-[#48CAE4] to-[#90E0EF] drop-shadow-[0_2px_2px_rgba(0,0,0,)] font-extrabold text-transparent text-3xl tracking-tight">
            AdaptMuse
          </span>
        </Link>
      </div>
    </div>
  );
};
