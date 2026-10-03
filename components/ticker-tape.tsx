"use client";

import React from "react";
import { tickerItems } from "@/data/ticker";

export function TickerTape() {
  // Duplicate items for continuous marquee loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div
      title="Portfolio statistics, not market quotes."
      className="h-8 bg-bg-inset border-b border-border flex items-center overflow-hidden select-none text-[11px] font-mono relative z-30"
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-inset to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg-inset to-transparent z-10 pointer-events-none" />

      <div className="animate-ticker flex items-center whitespace-nowrap">
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center mx-4 gap-2">
            <span className="text-text-muted">{item.label}</span>
            <span
              className={`font-semibold tabular-nums ${
                item.type === "up"
                  ? "text-up"
                  : item.type === "down"
                  ? "text-down"
                  : item.type === "accent"
                  ? "text-accent"
                  : "text-text"
              }`}
            >
              {item.value} {item.change && <span className="text-[9px]">{item.change}</span>}
            </span>
            <span className="text-border-strong mx-1">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
