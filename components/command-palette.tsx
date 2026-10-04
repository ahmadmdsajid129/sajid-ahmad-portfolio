"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/data/site";
import { useTheme } from "./theme-provider";
import { useToast } from "./toast-provider";
import { Search, CornerDownLeft, Sparkles, Terminal } from "lucide-react";

export interface CommandItem {
  code: string;
  name: string;
  category: "NAVIGATE" | "ACTION" | "RESEARCH" | "SYSTEM" | "HIDDEN";
  description: string;
  action: () => void;
  hidden?: boolean;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMMGame?: () => void;
  onOpenHelp?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenMMGame, onOpenHelp }: CommandPaletteProps) {
  const router = useRouter();
  const { toggleTheme, togglePhosphor } = useTheme();
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      code: "ABOUT",
      name: "About Factsheet",
      category: "NAVIGATE",
      description: "Jump to background & quant profile",
      action: () => {
        router.push("#about");
        addToast("Navigated to 01 // ABOUT", "info", "ABOUT");
      },
    },
    {
      code: "PROJ",
      name: "All Projects",
      category: "NAVIGATE",
      description: "Jump to quantitative tearsheets & models",
      action: () => {
        router.push("#projects");
        addToast("Navigated to 02 // PROJECTS", "info", "PROJ");
      },
    },
    {
      code: "LOB <GO>",
      name: "LOB Alpha Simulator",
      category: "RESEARCH",
      description: "Open Limit Order Book Tearsheet & MM Backtest",
      action: () => {
        router.push("/projects/lob-alpha-simulator");
        addToast("Loaded LOB Simulator Tearsheet", "success", "LOB");
      },
    },
    {
      code: "OPT <GO>",
      name: "Exotic Options Pricer",
      category: "RESEARCH",
      description: "Monte Carlo engine with variance reduction & Greeks",
      action: () => {
        router.push("/projects/exotic-options-pricer");
        addToast("Loaded Monte Carlo Options Pricer", "success", "OPT");
      },
    },
    {
      code: "FRAUD <GO>",
      name: "Fraud Risk Engine",
      category: "RESEARCH",
      description: "Streaming fraud-scoring pipeline with TreeSHAP",
      action: () => {
        router.push("/projects/real-time-payment-fraud-detection");
        addToast("Loaded Fraud Detection Engine", "success", "FRAUD");
      },
    },
    {
      code: "ECOM <GO>",
      name: "HimaVogue Marketplace",
      category: "RESEARCH",
      description: "Multi-vendor escrow platform & quant case study",
      action: () => {
        router.push("/projects/himavogue-ecommerce");
        addToast("Loaded E-Commerce Architecture Tearsheet", "success", "ECOM");
      },
    },
    {
      code: "EXP",
      name: "Experience & Timeline",
      category: "NAVIGATE",
      description: "Engineering roles & open-source quantitative system builds",
      action: () => {
        router.push("#experience");
        addToast("Navigated to 03 | EXPERIENCE", "info", "EXP");
      },
    },
    {
      code: "EDU",
      name: "Education & Coursework",
      category: "NAVIGATE",
      description: "Degree details, coursework, and reading",
      action: () => {
        router.push("#education");
        addToast("Navigated to 04 | EDUCATION", "info", "EDU");
      },
    },
    {
      code: "CV",
      name: "Download Resume",
      category: "ACTION",
      description: "Download current PDF resume",
      action: () => {
        window.open(siteConfig.resumeUrl, "_blank");
        addToast("Downloading Resume PDF...", "info", "CV");
      },
    },
    {
      code: "MAIL",
      name: "Copy Email",
      category: "ACTION",
      description: "Copy researcher email to clipboard",
      action: () => {
        navigator.clipboard.writeText(siteConfig.email);
        addToast("Email copied to clipboard", "success", "MAIL");
      },
    },
    {
      code: "TEL",
      name: "Copy Phone Number",
      category: "ACTION",
      description: "Copy phone (+91 7970872205) to clipboard",
      action: () => {
        navigator.clipboard.writeText(siteConfig.phone);
        addToast("Phone number copied to clipboard", "success", "TEL");
      },
    },
    {
      code: "GH",
      name: "GitHub Profile",
      category: "ACTION",
      description: "Open github.com/ahmadmdsajid129 in new tab",
      action: () => {
        window.open(siteConfig.github, "_blank");
      },
    },
    {
      code: "LI",
      name: "LinkedIn Profile",
      category: "ACTION",
      description: "Open LinkedIn in new tab",
      action: () => {
        window.open(siteConfig.linkedin, "_blank");
      },
    },
    {
      code: "THEME",
      name: "Toggle Theme",
      category: "SYSTEM",
      description: "Switch between Terminal Dark and Paper Light",
      action: () => {
        toggleTheme();
        addToast("Color theme switched", "info", "THEME");
      },
    },
    {
      code: "HELP",
      name: "Shortcut Guide",
      category: "SYSTEM",
      description: "Display keyboard navigation manual",
      action: () => {
        if (onOpenHelp) onOpenHelp();
      },
    },
    // Hidden Easter Eggs
    {
      code: "PHOSPHOR",
      name: "Phosphor Mode",
      category: "HIDDEN",
      description: "CRT Monochrome Green phosphor scanline mode",
      hidden: true,
      action: () => {
        togglePhosphor();
        addToast("PHOSPHOR CRT MODE TOGGLED", "success", "CRT");
      },
    },
    {
      code: "SHARPE",
      name: "Sharpe Reality Check",
      category: "HIDDEN",
      description: "Quant humor",
      hidden: true,
      action: () => {
        addToast("Sharpe: 4.2 in-sample, 0.4 out-of-sample with transaction fees.", "warn", "SHARPE");
      },
    },
    {
      code: "MM",
      name: "Market Maker Game",
      category: "HIDDEN",
      description: "Launch order flow simulator & adverse selection game",
      hidden: true,
      action: () => {
        if (onOpenMMGame) {
          onOpenMMGame();
        } else {
          router.push("#hero");
          addToast("Launched Market Maker simulator", "info", "MM");
        }
      },
    },
    {
      code: "SUDO",
      name: "Elevated Privileges",
      category: "HIDDEN",
      description: "Attempt root execution",
      hidden: true,
      action: () => {
        addToast("Nice try. Risk limits apply.", "error", "SUDO");
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    const q = query.trim().toUpperCase();
    if (!q) return !cmd.hidden;
    // If exact or partial match on hidden code
    if (cmd.hidden) {
      return cmd.code.includes(q) || cmd.name.toUpperCase().includes(q);
    }
    return (
      cmd.code.includes(q) ||
      cmd.name.toUpperCase().includes(q) ||
      cmd.description.toUpperCase().includes(q)
    );
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        } else if (query.trim()) {
          addToast(`Command not found: "${query}"`, "warn", "404");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, query, onClose, addToast]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 select-none"
      onClick={onClose}
    >
      <div
        className="terminal-panel w-full max-w-[640px] shadow-2xl overflow-hidden font-mono border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-bg-elevated gap-3">
          <span className="text-accent font-bold text-sm select-none">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type function code or search..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-faint focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] text-text-faint border border-border bg-bg-inset rounded">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-faint">
              NO MATCHING COMMAND // TYPE <span className="text-accent">HELP</span> FOR DIRECTORY
            </div>
          ) : (
            filtered.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={cmd.code}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors text-xs ${
                    isSelected ? "bg-accent-dim text-text border-l-2 border-accent" : "text-text-muted hover:bg-bg-inset"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        isSelected
                          ? "bg-accent text-bg"
                          : "bg-bg-inset border border-border text-accent"
                      }`}
                    >
                      {cmd.code}
                    </span>
                    <div>
                      <div className="font-semibold text-text flex items-center gap-2">
                        {cmd.name}
                        {cmd.hidden && (
                          <span className="text-[9px] text-accent border border-accent/40 px-1 py-0.2">
                            EASTER EGG
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-faint">{cmd.description}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-[11px] text-accent">
                      <span>RUN</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 bg-bg-inset border-t border-border flex items-center justify-between text-[11px] text-text-faint">
          <div className="flex items-center gap-2">
            <span>Use ↑↓ to navigate</span>
            <span>·</span>
            <span>↵ to execute</span>
          </div>
          <div>RESEARCH TERMINAL // CMD-PALETTE</div>
        </div>
      </div>
    </div>
  );
}
