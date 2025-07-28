"use client";

import { Bot, Home, Bell, Settings, Users, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();

  const publicRoutes = ["/", "/login", "/signup"];
  if (publicRoutes.includes(pathname)) return null;

  return (
    <div className="top-0 left-0 absolute flex flex-col bg-background-secondary p-6 border-r w-[100px] h-full">
      <div className="flex justify-center mb-8 rounded-md overflow-hidden">
        <Link href="/home">
          <Image
            src="/logo.png"
            alt="logo"
            width={55}
            height={55}
            className="cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex flex-col flex-1 items-center gap-10 mt-10">
        <Link
          href="/home"
          className={`p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/home" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <Home
            size={24}
            color="white"
            fill={pathname === "/home" ? "white" : "none"}
          />
        </Link>
        <Link
          href="/generate-content"
          className={`p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/generate-content"
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          <Bot
            size={24}
            color="white"
            fill={pathname === "/generate-content" ? "white" : "none"}
          />
        </Link>
        <Link
          href="/audience"
          className={`p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/audience" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <Users
            size={24}
            color="white"
            fill={pathname === "/audience" ? "white" : "none"}
          />
        </Link>
        <Link
          href="/jobs"
          className={`p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/jobs" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <List
            size={24}
            color="white"
            fill={pathname === "/jobs" ? "white" : "none"}
          />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-10">
        <Link
          href="/notifications"
          className={`p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/notifications" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <Bell
            size={24}
            color="white"
            fill={pathname === "/notifications" ? "white" : "none"}
          />
        </Link>
        <Link
          href="/settings"
          className={`p-2 rounded-lg transition-colors duration-200 ${
            pathname === "/settings" ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <Settings
            size={24}
            color="white"
            fill={pathname === "/settings" ? "white" : "none"}
          />
        </Link>
      </div>
    </div>
  );
};
