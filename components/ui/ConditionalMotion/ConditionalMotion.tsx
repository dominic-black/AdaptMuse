"use client";

import React, { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

// Dynamic import for framer-motion - only loads on desktop
const loadFramerMotion = () => import("framer-motion");

interface MotionDivProps {
  children?: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  whileInView?: any;
  viewport?: any;
  transition?: any;
  style?: React.CSSProperties;
  [key: string]: any;
}

interface ConditionalMotionProps extends MotionDivProps {
  fallbackComponent?: "div" | "section" | "main";
}

export const ConditionalMotion: React.FC<ConditionalMotionProps> = ({
  children,
  fallbackComponent = "div",
  className,
  initial,
  animate,
  whileInView,
  viewport,
  transition,
  style,
  ...props
}) => {
  const { isMobile, isLoaded } = useIsMobile();
  const [MotionComponent, setMotionComponent] = React.useState<any>(null);

  React.useEffect(() => {
    if (isLoaded && !isMobile) {
      loadFramerMotion().then((framerMotion) => {
        setMotionComponent(() => framerMotion.motion.div);
      });
    }
  }, [isMobile, isLoaded]);

  // Show static fallback while loading or on mobile
  if (!isLoaded || isMobile || !MotionComponent) {
    const FallbackComponent = fallbackComponent;
    return (
      <FallbackComponent className={className} style={style} {...props}>
        {children}
      </FallbackComponent>
    );
  }

  // Use framer-motion on desktop
  return (
    <MotionComponent
      className={className}
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
