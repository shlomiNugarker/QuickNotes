import React from "react";

interface AnimatedBackgroundProps {
  variant?: "gradient" | "dots" | "minimal";
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = "minimal",
}) => {
  // Simple, clean background - no animations
  return null;
};

export default AnimatedBackground;
