"use client";

import React, { useEffect, useState } from "react";

export function StatusBar() {
  const [sectionCode, setSectionCode] = useState("00 // OVERVIEW");
  const [utcTime, setUtcTime] = useState("");
  const [istTime, setIstTime] = useState("");

  // Live clocks for UTC and IST
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(
        now.toLocaleTimeString("en-GB", {
          timeZone: "UTC",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC"
      );
      setIstTime(
        now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST"
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track active section for status bar display
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      hero: "00 // HERO",
      about: "01 // ABOUT",
      projects: "02 // PROJECTS",
      live: "03 // LIVE TRACK",
      research: "04 // RESEARCH",
      education: "05 // EDUCATION",
      contact: "06 // CONTACT",
    };

    const handleScroll = () => {
      const ids = Object.keys(sectionMap);
      const scrollPos = window.scrollY + 250;

      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollPos) {
          setSectionCode(sectionMap[ids[i]]);
          return;
        }
      }
      setSectionCode("00 // OVERVIEW");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      aria-label="Terminal status bar"
      className="hidden md:flex fixed bottom-0 left-0 right-0 h-7 bg-bg-inset border-t border-border z-40 px-4 items-center justify-between font-mono text-[11px] text-text-muted select-none"
    >
      {/* Left: Active Section Code */}
      <div className="flex items-center gap-2">
        <span className="text-text-faint">LOC:</span>
        <span className="text-accent font-semibold">{sectionCode}</span>
      </div>

      {/* Middle: Command Palette Tip */}
      <div className="flex items-center gap-1.5 text-text-faint hover:text-text-muted transition-colors">
        <span>Press</span>
        <kbd className="px-1 py-0.5 bg-bg-elevated border border-border text-[10px] text-accent rounded-sm">
          /
        </kbd>
        <span>or</span>
        <kbd className="px-1 py-0.5 bg-bg-elevated border border-border text-[10px] text-accent rounded-sm">
          Ctrl+K
        </kbd>
        <span>for commands</span>
      </div>

      {/* Right: Clocks + Availability status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 tabular-nums text-text-muted">
          <span>{utcTime}</span>
          <span className="text-border-strong">|</span>
          <span>{istTime}</span>
        </div>
        <div className="flex items-center gap-1.5 pl-2 border-l border-border text-up">
          <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
          <span className="font-semibold text-[10px] tracking-wide">OPEN TO WORK</span>
        </div>
      </div>
    </footer>
  );
}
