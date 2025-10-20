import React, { useEffect, useState } from "react";

interface StatsCounterProps {
  end: number;
  duration?: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const StatsCounter: React.FC<StatsCounterProps> = ({
  end,
  duration = 2000,
  label,
  suffix = "",
  prefix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <div className="text-center animate-scaleIn">
      <div className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-muted-foreground text-sm md:text-base">
        {label}
      </div>
    </div>
  );
};

export default StatsCounter;
