"use client";

import React, { useState } from "react";
import { glossaryTerms } from "@/data/glossary";

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [show, setShow] = useState(false);
  const data = glossaryTerms[term] || {
    term,
    shortName: term,
    definition: "Quantitative finance concept.",
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((prev) => !prev)}
    >
      <span className="glossary-term font-mono text-inherit">
        {children || term}
      </span>
      {show && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-bg-elevated border border-accent text-text text-[11px] font-mono shadow-2xl z-50 rounded-sm pointer-events-none"
        >
          <span className="block font-bold text-accent mb-0.5 border-b border-border pb-1">
            {data.term}
          </span>
          <span className="block text-text-muted leading-relaxed">
            {data.definition}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent" />
        </span>
      )}
    </span>
  );
}
