import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const LandingScreen = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <main className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12 h-screen">
      <motion.div
        initial={isMobile ? {} : { opacity: 0, y: 40 }}
        animate={isMobile ? {} : { opacity: 1, y: 0 }}
        transition={isMobile ? {} : { duration: 0.8, ease: "easeOut" }}
        className={`flex flex-col justify-center items-center gap-4 sm:gap-6 bg-white/60 shadow-xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12 border border-white/50 rounded-2xl sm:rounded-3xl w-full max-w-2xl text-center ${
          !isMobile ? "backdrop-blur-lg" : ""
        }`}
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
          language models to deeply understand your audience and craft perfectly
          tailored content that resonates.
        </p>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
          <Button
            href="/signup"
            size="lg"
            className="shadow-lg w-full sm:w-auto text-sm sm:text-base"
          >
            Get Started
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
  );
};
