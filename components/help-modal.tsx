"use client";

import React, { useEffect } from "react";
import { X, Keyboard } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "1 - 6", desc: "Jump directly to section (Hero, About, Projects, Experience, Education, Contact)" },
    { key: "J / K", desc: "Next / Previous section" },
    { key: "⌘K / /", desc: "Open Command Palette" },
    { key: "T", desc: "Toggle Color Theme (Dark / Paper)" },
    { key: "P", desc: "Toggle Phosphor CRT Mode (Easter Egg)" },
    { key: "M", desc: "Toggle Mechanical Audio Click Feedback" },
    { key: "?", desc: "Open this Shortcut Manual" },
    { key: "Esc", desc: "Close any modal / active overlay" },
  ];

  const terminalCodes = [
    { code: "LOB <GO>", desc: "Limit order book tearsheet & microstructure model" },
    { code: "OPT <GO>", desc: "Monte Carlo derivatives pricing engine" },
    { code: "FRAUD <GO>", desc: "Real-time payment risk detection engine" },
    { code: "ECOM <GO>", desc: "Full-stack marketplace architecture study" },
    { code: "CV", desc: "Download quantitative resume PDF" },
    { code: "MAIL", desc: "Copy researcher email to clipboard" },
    { code: "MM", desc: "Interactive Market Making Simulator" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="terminal-panel max-w-xl w-full p-6 font-mono text-xs border border-border shadow-2xl bg-bg-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2 text-accent font-bold">
            <Keyboard className="w-4 h-4" />
            <span>TERMINAL SHORTCUTS & FUNCTION CODES</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-faint hover:text-accent border border-border rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-text-faint uppercase mb-2">
              Keyboard Shortcuts
            </div>
            <div className="space-y-1.5 bg-bg-inset p-3 border border-border rounded">
              {shortcuts.map((s) => (
                <div key={s.key} className="flex items-center justify-between py-1">
                  <kbd className="px-2 py-0.5 bg-bg-elevated border border-border text-accent font-semibold rounded text-[11px]">
                    {s.key}
                  </kbd>
                  <span className="text-text-muted text-[11px]">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-text-faint uppercase mb-2">
              Fast Function Codes (In Palette)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {terminalCodes.map((tc) => (
                <div
                  key={tc.code}
                  className="p-2 bg-bg-inset border border-border rounded flex flex-col gap-0.5"
                >
                  <span className="text-accent font-bold text-[11px]">{tc.code}</span>
                  <span className="text-text-faint text-[10px] leading-tight">{tc.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-text-faint">
          <span>Shortcuts disabled when typing in inputs</span>
          <span>PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
}
