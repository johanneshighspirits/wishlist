"use client";

import { randomGradientBackground } from "@/utils/random";
import clsx from "clsx";
import { PropsWithChildren, useEffect, useState } from "react";

export const FantasyBackground = ({
  backgroundColor,
  backgroundImage,
  className,
  children,
}: PropsWithChildren<{
  backgroundColor?: string;
  backgroundImage?: string;
  className?: string;
}>) => {
  const [bg, setBg] = useState(backgroundImage);
  const [bgColor, setBgColor] = useState(backgroundColor);
  useEffect(() => {
    if (!backgroundImage) {
      const { backgroundImage, backgroundColor } = randomGradientBackground();
      setBg(backgroundImage);
      setBgColor(backgroundColor);
    } else {
      setBg(backgroundImage);
      setBgColor(backgroundColor);
    }
  }, [backgroundImage, backgroundColor]);
  return (
    <div className={clsx("relative rounded-md overflow-hidden", className)}>
      <div
        style={{
          backgroundColor: bgColor,
          backgroundImage: bg,
          backgroundSize: "200% 200%",
        }}
        className="absolute inset-0 bg-white dark:bg-slate-800 -z-1"
      ></div>
      {children}
    </div>
  );
};
