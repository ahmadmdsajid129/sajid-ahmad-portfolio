"use client";

import React from "react";

interface ProjectVisualProps {
  slug: string;
}

export function ProjectCardVisual({ slug }: ProjectVisualProps) {
  if (slug === "lob-alpha-simulator") {
    // PRJ-001: Cumulative Equity Curve (Before vs After frictions)
    return (
      <div className="w-full h-32 bg-bg-inset border border-border/80 relative overflow-hidden p-2 group-hover:border-accent/40 transition-colors">
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-text-faint flex items-center gap-2">
          <span>PNL EQUITY TRAJECTORY</span>
          <span className="text-up">&mdash; Realistic passive MM</span>
          <span className="text-down opacity-50">&mdash;&middot; Naive mid (costs killed)</span>
        </div>
        <svg
          className="w-full h-full pt-4"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Grid lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1="40" x2="300" y2="40" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1="60" x2="300" y2="60" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* Naive mid-price curve (collapses with spread/fees) */}
          <path
            d="M0,45 Q60,35 120,40 T180,55 T240,68 L300,74"
            stroke="var(--down)"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Passive MM with adverse selection threshold (steady edge) */}
          <path
            d="M0,65 L40,62 L80,58 L120,48 L160,42 L200,32 L240,24 L280,18 L300,14"
            stroke="var(--up)"
            strokeWidth="1.8"
            className="transition-all duration-300"
          />
        </svg>
      </div>
    );
  }

  if (slug === "exotic-options-pricer") {
    // PRJ-002: Sparkline fan of GBM paths with barrier line
    return (
      <div className="w-full h-32 bg-bg-inset border border-border/80 relative overflow-hidden p-2 group-hover:border-accent/40 transition-colors">
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-text-faint flex items-center gap-2">
          <span>GBM MONTE CARLO FAN (100K PATHS)</span>
          <span className="text-accent">&middot; S0=100 K=100</span>
          <span className="text-down">&mdash; Barrier H=80</span>
        </div>
        <svg
          className="w-full h-full pt-4"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Barrier line */}
          <line x1="0" y1="68" x2="300" y2="68" stroke="var(--down)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Fan of sample paths */}
          <path d="M0,40 Q75,32 150,22 T300,10" stroke="var(--accent)" strokeWidth="0.8" opacity="0.7" />
          <path d="M0,40 Q75,38 150,30 T300,25" stroke="var(--accent)" strokeWidth="0.8" opacity="0.6" />
          <path d="M0,40 Q75,42 150,45 T300,38" stroke="var(--up)" strokeWidth="1.2" opacity="0.8" />
          <path d="M0,40 Q75,45 150,52 T300,50" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5" />
          <path d="M0,40 Q75,55 150,60 T300,65" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
          {/* Breached barrier path */}
          <path d="M0,40 Q60,50 120,70 L180,72 L300,75" stroke="var(--text-faint)" strokeWidth="0.7" opacity="0.3" />
        </svg>
      </div>
    );
  }

  if (slug === "real-time-payment-fraud-detection") {
    // PRJ-003: PR-Curve & Decision Score Distribution
    return (
      <div className="w-full h-32 bg-bg-inset border border-border/80 relative overflow-hidden p-2 group-hover:border-accent/40 transition-colors">
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-text-faint flex items-center gap-2">
          <span>PR-CURVE (AUC 0.9825) &middot; ECE 0.0014</span>
          <span className="text-up">&bull; Champion XGBoost</span>
        </div>
        <svg
          className="w-full h-full pt-4"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Grid */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* PR Curve high plateau */}
          <path
            d="M0,15 L180,16 L220,18 L260,25 L285,42 L300,75"
            stroke="var(--up)"
            strokeWidth="1.8"
          />
          {/* Baseline random guess */}
          <line x1="0" y1="72" x2="300" y2="72" stroke="var(--text-faint)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  // PRJ-004: Full-Stack Architecture flow thumbnail
  return (
    <div className="w-full h-32 bg-bg-inset border border-border/80 relative overflow-hidden p-2 group-hover:border-accent/40 transition-colors font-mono">
      <div className="absolute top-1.5 left-2 text-[9px] text-text-faint">
        ARCHITECTURE PIPELINE &middot; NEXT.js 14 &middot; MONGODB &middot; REDIS
      </div>
      <div className="pt-5 flex items-center justify-between text-[10px] text-text-muted h-full px-2">
        <div className="p-1.5 bg-bg-elevated border border-border text-center">
          <div className="text-text font-bold">CLIENT</div>
          <div className="text-[8px] text-text-faint">Next.js 14</div>
        </div>
        <span className="text-accent">&rarr;</span>
        <div className="p-1.5 bg-bg-elevated border border-border text-center">
          <div className="text-accent font-bold">API / ESCROW</div>
          <div className="text-[8px] text-text-faint">Server Verify</div>
        </div>
        <span className="text-accent">&rarr;</span>
        <div className="p-1.5 bg-bg-elevated border border-border text-center">
          <div className="text-up font-bold">DB / CACHE</div>
          <div className="text-[8px] text-text-faint">Mongo + Redis</div>
        </div>
      </div>
    </div>
  );
}
