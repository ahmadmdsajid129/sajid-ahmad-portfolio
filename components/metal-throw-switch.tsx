"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { sound } from "@/lib/sound";

export function MetalThrowSwitch() {
  const { theme, togglePhosphor } = useTheme();
  const isPhosphor = theme === "phosphor";

  const handleToggle = () => {
    sound?.playMetalSwitch(!isPhosphor);
    togglePhosphor();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      role="switch"
      aria-checked={isPhosphor}
      aria-label="CRT Phosphor Mode Industrial Metal Switch"
      title={`CRT Phosphor Hardware Switch [Key: P] - Current: ${isPhosphor ? "ENGAGED" : "OFF"}`}
      className="relative group flex items-center gap-1.5 sm:gap-2 px-2 py-1 bg-gradient-to-b from-[#24282e] via-[#1a1c20] to-[#121417] border border-[#3e444e] hover:border-accent/70 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_4px_rgba(0,0,0,0.6)] transition-all select-none active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-accent"
    >
      {/* Screw rivet left */}
      <div className="w-1.5 h-1.5 rounded-full bg-[#353a42] border border-[#1b1d22] shadow-inner flex items-center justify-center">
        <div className="w-1 h-[0.5px] bg-[#111] rotate-45" />
      </div>

      {/* Plate Engraving & Indicator LED */}
      <div className="flex flex-col items-start leading-none gap-0.5">
        <div className="flex items-center gap-1">
          <span className="font-mono text-[9px] font-bold tracking-wider text-[#a0a8b4] group-hover:text-text transition-colors">
            CRT
          </span>
          {/* LED indicator */}
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isPhosphor
                ? "bg-[#33ff99] shadow-[0_0_8px_#33ff99,0_0_12px_rgba(51,255,153,0.85)] animate-pulse"
                : "bg-[#553300] border border-[#332200]"
            }`}
          />
        </div>
        <span className="font-mono text-[7px] text-[#6b7280] tracking-tight">
          {isPhosphor ? "LIVE" : "STBY"}
        </span>
      </div>

      {/* Industrial Switch Socket & 3D Toggle Bat */}
      <div
        className="relative w-5 h-7 flex items-center justify-center"
        style={{ perspective: "350px" }}
      >
        {/* Recessed bezel socket (dark well) */}
        <div className="absolute inset-x-0 inset-y-1 bg-[#090b0d] border border-[#2b3038] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />

        {/* 3D Metal Lever */}
        <div
          className="relative z-10 w-2.5 h-6 flex flex-col items-center justify-between transition-transform duration-200 ease-out"
          style={{
            transformOrigin: "50% 65%",
            transform: isPhosphor
              ? "rotateX(-32deg) translateY(-2px)"
              : "rotateX(30deg) translateY(3px)",
            filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.75))",
          }}
        >
          {/* Rounded Chrome Bat Tip */}
          <div
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
              isPhosphor
                ? "bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#d0d0d0_40%,#7a7a7a_75%,#3a3a3a_100%)] ring-1 ring-[#33ff99]/40"
                : "bg-[radial-gradient(circle_at_35%_35%,#e8e8e8_0%,#a8a8a8_45%,#525252_80%,#2b2b2b_100%)]"
            }`}
            style={{
              boxShadow: isPhosphor
                ? "0 0 6px rgba(51,255,153,0.4), inset 0 1px 1px #fff"
                : "inset 0 1px 1px rgba(255,255,255,0.7)",
            }}
          />

          {/* Cylindrical Brushed Metal Shaft */}
          <div
            className="w-1.5 h-3.5 rounded-sm bg-gradient-to-r from-[#444] via-[#ddd] via-[#fff] to-[#555] shadow-sm"
          />
        </div>
      </div>

      {/* Screw rivet right */}
      <div className="w-1.5 h-1.5 rounded-full bg-[#353a42] border border-[#1b1d22] shadow-inner flex items-center justify-center">
        <div className="w-1 h-[0.5px] bg-[#111] -rotate-45" />
      </div>
    </button>
  );
}
