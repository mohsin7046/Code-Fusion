import React from "react";
import LottiePlayer from "react-lottie-player";
import SignupAnimation from "./AnimationSignUp.json";

const LottieAnimation3 = ({ width = 300, height = 300, loop = true, autoplay = true }) => {
  return (
    <div style={{ width, height }}>
      <LottiePlayer
        animationData={SignupAnimation}
        loop={loop}
        play={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation3;
