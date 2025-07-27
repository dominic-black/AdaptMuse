import React from "react";
import { useLottie } from "lottie-react";

interface LottieAnimationProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  width = "100%",
  height = "100%",
  className = "",
}) => {
  const options = {
    animationData,
    loop,
    autoplay,
  };

  const style = {
    width,
    height,
  };

  const { View } = useLottie(options, style);

  return <div className={className}>{View}</div>;
};