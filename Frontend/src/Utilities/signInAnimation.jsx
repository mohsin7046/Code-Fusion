import React from "react";
import LottiePlayer from "react-lottie-player";
import LoginAnimation from "./AnimationLogin.json";

const LottieAnimation2 = ({ width = 300, height = 300, loop = true, autoplay = true }) => {
  return (
    <div style={{ width, height }}>
      <LottiePlayer
        animationData={LoginAnimation}
        loop={loop}
        play={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation2;
