"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground/AnimatedBackground";
import { motion } from "framer-motion";
import { ArrowRight, Users, Bot, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <AnimatedBackground />

      {/* Header */}
      <header className="top-0 z-20 absolute flex justify-between items-center px-4 sm:px-6 lg:px-12 py-3 sm:py-4 w-full">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="sm:w-10 sm:h-10"
          />
          <span className="font-extrabold text-[var(--color-text)] text-lg sm:text-xl tracking-tight">
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

      <main className="flex flex-col flex-1 justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 lg:h-screen">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center items-center gap-4 sm:gap-6 bg-white/60 shadow-xl backdrop-blur-lg px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12 border border-white/50 rounded-2xl sm:rounded-3xl w-full max-w-2xl text-center"
        >
          <span className="inline-block bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-1 sm:mb-2 font-semibold text-transparent text-xs sm:text-sm uppercase tracking-widest">
            CULTURAL INTELLIGENCE MEETS AI
          </span>

          <h1 className="font-extrabold text-[var(--color-text)] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight tracking-tight">
            Create Content Your Audience
            <br />
            <span className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-transparent">
              Truly Cares About
            </span>
          </h1>

          <p className="opacity-80 mx-auto max-w-lg text-[var(--color-text)] text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">
            AdaptMuse leverages the power of Qloo&apos;s Taste AI™ and advanced
            language models to deeply understand your audience and craft
            perfectly tailored content that resonates.
          </p>

          <div className="flex sm:flex-row flex-col justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
            <Button
              href="/signup"
              size="lg"
              className="shadow-lg w-full sm:w-auto text-sm sm:text-base"
            >
              Try AdaptMuse Now
            </Button>
            <Button
              href="#features"
              variant="outline"
              size="lg"
              className="border-[var(--color-primary)] w-full sm:w-auto text-[var(--color-primary)] text-sm sm:text-base"
            >
              See How It Works
              <ArrowRight className="ml-1 sm:ml-2 w-3 sm:w-4 h-3 sm:h-4" />
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="z-10 relative bg-[var(--color-background)]/80 backdrop-blur-sm py-12 sm:py-16 lg:py-20 xl:py-28"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-2 sm:mb-3 font-semibold text-transparent text-sm sm:text-base uppercase tracking-widest">
              A Complete AI Audience Platform
            </h2>
            <p className="mb-3 sm:mb-5 font-bold text-[var(--color-text)] text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              Insight. Creation. Results.
            </p>
            <p className="opacity-80 mx-auto max-w-2xl text-[var(--color-text)] text-base sm:text-lg leading-relaxed">
              AdaptMuse integrates cutting-edge AI with Qloo’s unparalleled
              cultural insights, enabling unprecedented audience engagement
              without compromising privacy.
            </p>
          </motion.div>

          <div className="gap-4 sm:gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-12 lg:mt-16">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                className="flex flex-col items-center bg-white shadow-lg p-5 sm:p-6 lg:p-7 border border-[var(--color-background-secondary-cell)] rounded-xl sm:rounded-2xl text-center lg:hover:scale-[1.03] hover:scale-[1.02] transition-transform duration-300"
              >
                <span className="flex justify-center items-center bg-gradient-to-tr from-purple-400 to-indigo-400 mb-3 sm:mb-4 rounded-lg w-10 sm:w-12 h-10 sm:h-12">
                  {feature.icon}
                </span>
                <h3 className="mb-2 font-semibold text-[var(--color-text)] text-base sm:text-lg">
                  {feature.title}
                </h3>
                <p className="opacity-80 text-[var(--color-text)] text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-background)]/80 backdrop-blur-sm py-6 sm:py-8 border-[var(--color-background-secondary)]/50 border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <p className="opacity-60 text-[var(--color-text)] text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} AdaptMuse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Users className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />,
    title: "Audience Analysis",
    description:
      "Deep insights into your audience's demographics, interests, and behaviors with real-time segmentation.",
  },
  {
    icon: <Bot className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />,
    title: "AI Content Generation",
    description:
      "Generate high-impact, on-brand content in seconds with advanced AI models fine-tuned to your voice.",
  },
  {
    icon: (
      <BarChart className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />
    ),
    title: "Performance Tracking",
    description:
      "See exactly what's working with smart, actionable metrics and live performance dashboards.",
  },
];
