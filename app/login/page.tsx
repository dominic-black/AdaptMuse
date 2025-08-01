"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/features/auth/LoginForm/LoginForm";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground/AnimatedBackground";

export default function Login() {
  return (
    <div className="relative pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(3rem,env(safe-area-inset-top))] flex justify-center items-center px-4 sm:px-6 lg:px-8 py-12 h-[100dvh]">
      <AnimatedBackground />
      <div className="z-10 relative space-y-8 bg-white/60 shadow-xl backdrop-blur-lg p-8 sm:p-10 border border-white/50 rounded-2xl sm:rounded-3xl w-full max-w-md">
        <div>
          <Image
            className="mx-auto w-auto h-12"
            src="/logo.png"
            alt=""
            width={48}
            height={48}
          />
          <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mt-6 font-extrabold text-transparent text-2xl sm:text-3xl text-center tracking-tight">
            Sign in to your account
          </h2>
          <p className="opacity-80 mt-2 text-[var(--color-text)] text-sm text-center">
            Or
            <Link
              href="/signup"
              className="ml-1 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
