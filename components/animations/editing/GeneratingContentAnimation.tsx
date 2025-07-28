import React from "react";
import loadingAnimation from "./loading.json";
import writingAnimation from "./writing.json";
import { LottieAnimation } from "../LottieAnimation";

export const GeneratingContentAnimation = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <LottieAnimation
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        width={width}
        height={height}
      />
      <div className="absolute ml-3">
        <LottieAnimation
          animationData={writingAnimation}
          loop={true}
          autoplay={true}
          width={width / 2}
          height={height / 2}
        />
      </div>
    </div>
  );
};
