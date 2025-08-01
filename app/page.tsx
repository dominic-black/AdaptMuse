"use client";

import { LandingScreen } from "@/features/landing/components/LandingScreen/LandingScreen";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground/AnimatedBackground";
import { useEffect, useState } from "react";
import { Header } from "@/features/landing/components/Header/Header";
import { LandingInfoCards } from "@/features/landing/components/LandingInfoCards/LandingInfoCards";
import { Footer } from "@/features/landing/components/Footer/Footer";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1100);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen">
      {!isMobile && <AnimatedBackground />}
      <Header />
      <LandingScreen isMobile={isMobile} />
      <LandingInfoCards isMobile={isMobile} />
      <Footer />
    </div>
  );
}
