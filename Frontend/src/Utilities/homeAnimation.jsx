/* eslint-disable react/prop-types */
import LottiePlayer from "react-lottie-player";
import AnimationHome from "./AnimationHome.json";

const LottieAnimation = ({ width = 300, height = 300, loop = true, autoplay = true }) => {
  return (
    <div style={{ width, height }}>
      <LottiePlayer
        animationData={AnimationHome}
        loop={loop}
        play={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation;
