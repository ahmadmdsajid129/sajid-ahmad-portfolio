"use client";

import React, { useState } from "react";
import { experienceData, ExperienceItem } from "@/data/experience";
import { ChevronDown, ChevronUp, Briefcase } from "lucide-react";

export function ExperienceSection() {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "exp-001": true,
    "exp-002": true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="experience" className="pt-20 border-t border-border space-y-10">
      <div>
        <div className="section-label mb-2">EXPERIENCE // TRADE BLOTTER</div>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
          CHRONOLOGICAL <span className="text-accent">// TIMELINE</span>
        </h2>
        <p className="text-sm font-mono text-text-muted mt-2 max-w-2xl">
          Engineering roles and open-source quantitative system builds, grounded strictly in verifiable codebase implementations.
        </p>
      </div>

      {/* Vertical Trade-Blotter Timeline */}
      <div className="relative border-l-2 border-border ml-3 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {experienceData.map((item) => {
          const isExpanded = !!expandedIds[item.id];
          return (
            <div key={item.id} className="relative group">
              {/* Timeline Amber Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 bg-bg border-2 border-accent rounded-full group-hover:bg-accent transition-colors" />

              <div className="terminal-panel p-5 bg-bg-elevated border border-border hover:border-border-strong transition-all space-y-3 font-mono text-xs">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/50 pb-2">
                  <div>
                    <h3 className="text-base font-bold font-heading text-text">
                      {item.role}
                    </h3>
                    <div className="text-accent font-semibold text-xs mt-0.5">
                      {item.organization} &middot; <span className="text-text-faint">{item.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-faint text-[11px] tabular-nums">
                      {item.dateRange}
                    </span>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 hover:text-accent text-text-faint rounded"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Bullets */}
                {isExpanded && (
                  <ul className="space-y-2 text-text-muted leading-relaxed font-sans text-sm">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent font-mono text-xs mt-1">&bull;</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.metricsPlaceholder && (
                  <div className="text-[11px] text-text-faint pt-1 border-t border-border/40 font-mono">
                    {item.metricsPlaceholder}
                  </div>
                )}

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-bg-inset border border-border text-[10px] text-text-faint"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
