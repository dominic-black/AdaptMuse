"use client";

import Image from "next/image";
import Link from "next/link";
import SignupForm from "@/features/auth/SignupForm/SignupForm";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground/AnimatedBackground";
import { ConditionalMotion } from "@/components/ui/ConditionalMotion/ConditionalMotion";

export default function Signup() {
  return (
    <div className="pb-[max(3rem,env(safe-area-inset-bottom))] relative pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(3rem,env(safe-area-inset-top))] flex justify-center items-center px-4 sm:px-6 lg:px-8 py-12 min-h-[100dvh] min-h-screen">
      <AnimatedBackground />
      <ConditionalMotion
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 relative space-y-8 bg-white/60 shadow-xl backdrop-blur-lg p-8 sm:p-10 border border-white/50 rounded-2xl sm:rounded-3xl w-full max-w-md"
      >
        <div>
          <Image
            className="mx-auto w-auto h-12"
            src="/logo.png"
            alt="AdaptMuse Logo"
            width={48}
            height={48}
          />
          <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mt-6 font-extrabold text-transparent text-2xl sm:text-3xl text-center tracking-tight">
            Create your account
          </h2>
          <p className="opacity-80 mt-2 text-[var(--color-text)] text-sm text-center">
            Or
            <Link
              href="/login"
              className="ml-1 font-medium text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <SignupForm />
      </ConditionalMotion>
    </div>
  );
}
