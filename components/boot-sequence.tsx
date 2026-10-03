"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";

export function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Check if reduced motion is requested
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // Check if already booted in this session
    try {
      if (sessionStorage.getItem("terminal_booted")) {
        return;
      }
    } catch {
      // Ignore storage errors
    }

    setVisible(true);

    const bootLines = [
      "> INITIALIZING RESEARCH TERMINAL...",
      "> LOADING MATCHING ENGINE ........ OK",
      "> LOADING MONTE CARLO KERNEL ..... OK",
      `> WELCOME, ${siteConfig.firstName.replace("[[PLACEHOLDER: ", "").replace("]]", "")}`,
    ];

    const timeouts: NodeJS.Timeout[] = [];

    bootLines.forEach((line, idx) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, line]);
      }, (idx + 1) * 220);
      timeouts.push(t);
    });

    const endTimeout = setTimeout(() => {
      dismiss();
    }, 1200);
    timeouts.push(endTimeout);

    const handleSkip = () => {
      dismiss();
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);

    function dismiss() {
      timeouts.forEach(clearTimeout);
      try {
        sessionStorage.setItem("terminal_booted", "true");
      } catch {
        // Ignore
      }
      setVisible(false);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center font-mono text-sm px-4 select-none cursor-pointer"
        >
          <div className="terminal-panel p-6 max-w-lg w-full bg-bg-elevated border border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4 text-xs text-text-muted">
              <span className="text-accent font-bold">TERMINAL BOOT // v1.0</span>
              <span className="text-text-faint text-[10px]">CLICK OR KEY TO SKIP</span>
            </div>
            <div className="space-y-1.5 text-text min-h-[96px]">
              {lines.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={i === lines.length - 1 ? "text-accent font-bold" : "text-text-muted"}>
                    {line}
                  </span>
                </div>
              ))}
              <span className="inline-block w-2 h-4 bg-accent animate-blink ml-1 align-middle" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
