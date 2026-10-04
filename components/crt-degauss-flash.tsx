"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/sound";

export function CrtDegaussFlash() {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      // Respect prefers-reduced-motion
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      setIsFlashing(true);
      sound?.playDegauss();
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 550);
      return () => clearTimeout(timer);
    };

    window.addEventListener("trigger-crt-degauss", handleTrigger);
    return () => {
      window.removeEventListener("trigger-crt-degauss", handleTrigger);
    };
  }, []);

  if (!isFlashing) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* 1. Fullscreen phosphor flash bloom & magnetic pulse */}
      <div className="absolute inset-0 bg-[#33ff99]/25 animate-crt-bloom mix-blend-screen" />

      {/* 2. Magnetic barrel distortion vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)] animate-crt-degauss" />

      {/* 3. Intense cathode ray center flash beam */}
      <div className="w-full h-1 bg-white shadow-[0_0_35px_12px_#33ff99,0_0_90px_25px_#ffffff] animate-crt-beam" />
    </div>
  );
}
