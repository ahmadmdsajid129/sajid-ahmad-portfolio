"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { OrderBookSimulator } from "./orderbook-simulator";
import { ArrowRight, ArrowDown, ChevronDown } from "lucide-react";
import { useToast } from "./toast-provider";
import { SplitFlapBoard } from "./split-flap-ticker";
import { sound } from "@/lib/sound";

interface StatItemProps {
  value: string;
  label: string;
  detail: string;
  isLive?: boolean;
  onClick?: () => void;
  isRefreshing?: boolean;
  clickableHint?: string;
}

function StatItem({
  value,
  label,
  detail,
  isLive,
  onClick,
  isRefreshing,
  clickableHint,
}: StatItemProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      title={clickableHint || detail}
      className={`terminal-panel p-3 border-t-2 border-t-accent bg-bg-elevated/70 group transition-all h-full select-none ${
        isClickable
          ? "cursor-pointer hover:border-accent hover:bg-bg-elevated active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-accent"
          : "hover:border-accent/80"
      }`}
    >
      <div className="font-mono text-2xl lg:text-3xl font-bold text-text tabular-nums tracking-tight h-8 sm:h-9 flex items-center">
        <SplitFlapBoard value={value} />
      </div>
      <div className="font-mono text-[11px] font-semibold text-text-muted uppercase mt-1 flex items-center gap-1.5">
        <span>{label}</span>
        {isLive && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-up animate-pulse"
            title="Live verified from GitHub (public + private contributions)"
          />
        )}
      </div>
      <div className="font-mono text-[10px] text-text-faint truncate">
        {isRefreshing ? "Refreshing from GitHub..." : detail}
      </div>
    </div>
  );
}

interface HeroSectionProps {
  onOpenMMGame?: () => void;
  onOpenPalette?: () => void;
}

export function HeroSection({ onOpenMMGame, onOpenPalette }: HeroSectionProps) {
  const { addToast } = useToast();
  const [commitCount, setCommitCount] = useState<string>("1,286");
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchCommits = async (force: boolean = false) => {
    if (isRefreshing) return;
    if (force) {
      setIsRefreshing(true);
      sound?.playFlapTick(1.2);
      addToast("Connecting to GitHub contributions API...", "info", "GIT");
    }

    try {
      const url = force
        ? `/api/github-commits?refresh=true&t=${Date.now()}`
        : "/api/github-commits";
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.commits) {
        if (force) {
          sound?.playSectionTick();
          addToast(`Live commits updated: ${data.commits}`, "success", "GIT");
        }
        setCommitCount(String(data.commits));
        setIsLive(data.source === "github-api");
      }
    } catch {
      if (force) {
        addToast("Unable to refresh GitHub API right now", "warn", "GIT");
      }
    } finally {
      if (force) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchCommits(false);
  }, []);

  const handleResumeDownload = () => {
    addToast("Resume downloading...", "info", "CV");
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-88px)] flex flex-col justify-between pt-8 pb-12 overflow-hidden"
    >
      {/* Background drifting price-path line at ~4% opacity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <svg
          className="w-full h-full text-accent/10"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 400"
        >
          <path
            d="M0,220 Q150,180 300,240 T600,190 T900,260 T1200,160"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* 5.1 Left Column (7 cols desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-bg-elevated border border-border text-accent text-[11px] font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>QUANTITATIVE RESEARCH | MARKET MICROSTRUCTURE | DERIVATIVES PRICING | ML SYSTEMS</span>
          </div>

          {/* Mask-Reveal H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.08] text-text">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
            >
              I turn noisy data into
            </motion.div>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-accent"
            >
              testable edges.
            </motion.div>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-text-muted max-w-[62ch] font-normal leading-relaxed">
            {siteConfig.pitch}
          </p>

          {/* Stat Row (4 blocks, count-up, amber top border, using REAL numbers) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <StatItem value="5" label="Projects" detail="Shipped & documented" />
            <StatItem value="61/61" label="Tests Pass" detail="Fraud engine test suite" />
            <StatItem value="100K" label="MC Paths" detail="Vectorized pricing run" />
            <StatItem
              value={commitCount}
              label="Live Commits"
              detail="github.com/ahmadmdsajid129"
              isLive={isLive}
              onClick={() => fetchCommits(true)}
              isRefreshing={isRefreshing}
              clickableHint="Click to query live GitHub contributions API"
            />
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="h-12 px-6 bg-accent hover:bg-accent/90 text-bg font-mono font-bold text-xs tracking-wider flex items-center gap-2 rounded transition-all shadow-lg active:scale-98"
            >
              <span>VIEW PROJECTS</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={siteConfig.resumeUrl}
              download
              onClick={handleResumeDownload}
              className="h-12 px-5 bg-transparent border border-accent text-accent hover:bg-accent hover:text-bg font-mono font-bold text-xs tracking-wider flex items-center gap-2 rounded transition-all active:scale-98"
            >
              <span>DOWNLOAD RESUME</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenPalette}
              className="text-xs font-mono text-text-faint hover:text-text-muted transition-colors flex items-center gap-1.5"
            >
              <span>or press</span>
              <kbd className="px-1.5 py-0.5 bg-bg-elevated border border-border text-accent text-[11px] rounded-sm">
                ⌘K
              </kbd>
              <span>to navigate</span>
            </button>
          </div>

          {/* Availability line with blinking green dot */}
          <div className="pt-2 flex items-center gap-2 font-mono text-xs text-text-faint">
            <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
            <span>
              Open to quant research / trading / dev roles. Available from{" "}
              <span className="text-text">{siteConfig.availableFrom}</span>. Based in{" "}
              <span className="text-text">{siteConfig.location}</span>, open to relocation.
            </span>
          </div>
        </div>

        {/* 5.2 Right Column: Live LOB:SIM Panel (5 cols desktop / stacked mobile) */}
        <div className="lg:col-span-5 w-full">
          <OrderBookSimulator onOpenMMGame={onOpenMMGame} />
        </div>
      </div>

      {/* 5.3 Scroll Hint at bottom */}
      <div className="relative z-10 flex justify-center pt-8 pb-2">
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-text-faint hover:text-accent transition-colors"
        >
          <span>SCROLL</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
