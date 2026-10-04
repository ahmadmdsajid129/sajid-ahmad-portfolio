"use client";

import React, { useState, useEffect, useRef } from "react";
import { sound } from "@/lib/sound";

interface SplitFlapCharProps {
  char: string;
  delayIndex?: number;
  interactive?: boolean;
}

const CHAR_SET = "0123456789/K%.-+ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function SplitFlapChar({ char, delayIndex = 0 }: SplitFlapCharProps) {
  const [currentChar, setCurrentChar] = useState<string>(" ");
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const targetCharRef = useRef<string>(char);
  targetCharRef.current = char;

  useEffect(() => {
    // If reduced motion is requested, show immediately
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrentChar(char);
      return;
    }

    let isMounted = true;
    let stepCount = 0;
    const maxSteps = 4 + (delayIndex * 2); // Stagger cascade per column
    let stepInterval: NodeJS.Timeout | null = null;

    const startDelay = setTimeout(() => {
      if (!isMounted) return;

      stepInterval = setInterval(() => {
        if (!isMounted) return;
        stepCount++;

        if (stepCount >= maxSteps) {
          setCurrentChar(targetCharRef.current);
          setIsFlipping(false);
          sound?.playFlapTick(0.9 + Math.random() * 0.2);
          if (stepInterval) clearInterval(stepInterval);
        } else {
          // Flip to a random intermediate character from set
          const randomChar = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
          setCurrentChar(randomChar);
          setIsFlipping(true);
          sound?.playFlapTick(0.85 + (stepCount * 0.04));
        }
      }, 55);
    }, delayIndex * 70);

    return () => {
      isMounted = false;
      clearTimeout(startDelay);
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [char, delayIndex]);

  return (
    <div
      className="relative inline-block select-none"
      style={{
        perspective: "300px",
        width: char === " " ? "0.45em" : "0.72em",
        height: "1.25em",
      }}
    >
      {/* Physical Split-Flap Frame */}
      <div className="relative w-full h-full bg-bg-inset border border-border/80 rounded-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col font-mono font-bold leading-none">
        
        {/* Top Half */}
        <div className="relative w-full h-1/2 overflow-hidden bg-gradient-to-b from-[#181D26] to-[#12161E] border-b border-black/80 flex items-end justify-center">
          <span
            className="text-text tabular-nums"
            style={{
              transform: "translateY(50%)",
            }}
          >
            {currentChar}
          </span>
          {/* Top highlight glare */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 pointer-events-none" />
        </div>

        {/* Center Mechanical Split Seam & Hinge Notches */}
        <div className="relative w-full h-0 z-10">
          <div className="absolute inset-x-0 -top-[0.5px] h-[1px] bg-black/90 shadow-sm" />
          {/* Left hinge notch */}
          <div className="absolute -left-[1px] -top-[1.5px] w-[2px] h-[3px] bg-border-strong rounded-r-sm" />
          {/* Right hinge notch */}
          <div className="absolute -right-[1px] -top-[1.5px] w-[2px] h-[3px] bg-border-strong rounded-l-sm" />
        </div>

        {/* Bottom Half */}
        <div className="relative w-full h-1/2 overflow-hidden bg-gradient-to-b from-[#0F131A] to-[#151A24] flex items-start justify-center">
          <span
            className="text-text tabular-nums"
            style={{
              transform: "translateY(-50%)",
            }}
          >
            {currentChar}
          </span>
          {/* Bottom shadow */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-black/40 pointer-events-none" />
        </div>

        {/* 3D Flap Down Shadow Overlay when flipping */}
        {isFlipping && (
          <div className="absolute inset-0 bg-accent/5 pointer-events-none transition-opacity" />
        )}
      </div>
    </div>
  );
}

interface SplitFlapBoardProps {
  value: string;
  className?: string;
  interactive?: boolean;
}

export function SplitFlapBoard({ value, className = "", interactive = true }: SplitFlapBoardProps) {
  const [key, setKey] = useState(0);

  const reflip = () => {
    if (interactive) {
      setKey((prev) => prev + 1);
    }
  };

  const chars = value.split("");

  return (
    <div
      key={key}
      onClick={reflip}
      title={interactive ? "Click to re-flip mechanical reel" : undefined}
      className={`inline-flex items-center gap-[2px] ${
        interactive ? "cursor-pointer group" : ""
      } ${className}`}
      aria-label={value}
    >
      {chars.map((c, i) => (
        <SplitFlapChar key={`${i}-${c}`} char={c} delayIndex={i} />
      ))}
    </div>
  );
}
