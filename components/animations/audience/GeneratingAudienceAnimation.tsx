import React from "react";
import generatingAnimation from "./GeneratingAudience.json";
import { LottieAnimation } from "../LottieAnimation";

export const GeneratingAudienceAnimation = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return (
    <LottieAnimation
      animationData={generatingAnimation}
      loop={true}
      autoplay={true}
      width={width}
      height={height}
    />
  );
};
