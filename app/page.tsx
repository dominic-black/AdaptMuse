"use client";

import { LandingScreen } from "@/features/landing/components/LandingScreen/LandingScreen";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground/AnimatedBackground";
import { Header } from "@/features/landing/components/Header/Header";
import { LandingInfoCards } from "@/features/landing/components/LandingInfoCards/LandingInfoCards";
import { Footer } from "@/features/landing/components/Footer/Footer";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <AnimatedBackground />
      <Header />
      <LandingScreen />
      <LandingInfoCards />
      <Footer />
    </div>
  );
}
