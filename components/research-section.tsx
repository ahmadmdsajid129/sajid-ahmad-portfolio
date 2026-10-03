"use client";

import React from "react";
import Link from "next/link";
import { antiPortfolioEntries, researchNotesList } from "@/data/antiportfolio";
import { GlossaryTooltip } from "./glossary-tooltip";
import { AlertOctagon, ArrowRight, Rss, BookOpen, Skull, Flame } from "lucide-react";

export function ResearchSection() {
  return (
    <section id="research" className="pt-20 border-t border-border space-y-16">
      {/* Header */}
      <div>
        <div className="section-label mb-2">04 | RESEARCH &amp; NOTES</div>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
          THE ANTI-PORTFOLIO <span className="text-accent">| WHAT FAILED</span>
        </h2>
        <p className="text-sm font-mono text-text-muted mt-2 max-w-2xl leading-relaxed">
          Anyone can show a cherry-picked backtest. The true measure of a quantitative researcher is knowing where their models break, why hypotheses died, and how execution frictions impact alpha.
        </p>
      </div>

      {/* Multiple-Testing Counter Blotter */}
      <div className="terminal-panel p-4 bg-bg-inset border border-border font-mono text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-warn" />
          <span className="text-text font-bold uppercase">Multiple-Testing Correction Audit:</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-[11px] tabular-nums">
          <div>
            <span className="text-text-faint">VARIANTS TESTED: </span>
            <span className="text-accent font-bold">[[PLACEHOLDER: 48]]</span>
          </div>
          <div>
            <span className="text-text-faint">EXPECTED NOISE SHARPE: </span>
            <span className="text-down font-bold">[[PLACEHOLDER: 1.82]]</span>
          </div>
          <div>
            <GlossaryTooltip term="Deflated Sharpe">
              <span className="text-text-faint">DEFLATED SHARPE: </span>
            </GlossaryTooltip>
            <span className="text-up font-bold">[[PLACEHOLDER: 1.45]]</span>
          </div>
        </div>
      </div>

      {/* The Anti-Portfolio Table / Cards */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
          FAILED HYPOTHESES &amp; POST-MORTEMS
        </div>

        <div className="space-y-3">
          {antiPortfolioEntries.map((entry) => (
            <div
              key={entry.id}
              className="terminal-panel p-5 bg-bg-elevated border border-border hover:border-border-strong transition-all font-mono text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      entry.statusStamp === "COSTS KILLED IT"
                        ? "bg-down/20 border border-down text-down"
                        : entry.statusStamp === "OVERFIT"
                        ? "bg-warn/20 border border-warn text-warn"
                        : "bg-text-faint/20 border border-text-faint text-text-muted"
                    }`}
                  >
                    {entry.statusStamp}
                  </span>
                  <span className="text-text font-bold text-sm">{entry.idea}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] tabular-nums">
                  <span className="text-text-faint">IS: <strong className="text-accent">{entry.inSampleMetric}</strong></span>
                  <span className="text-text-faint">&rarr;</span>
                  <span className="text-text-faint">OOS: <strong className="text-down">{entry.outOfSampleMetric}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-muted leading-relaxed font-sans text-xs">
                <div>
                  <span className="font-mono text-[10px] text-text-faint uppercase block mb-0.5">
                    Root Cause:
                  </span>
                  {entry.cause}
                </div>
                <div>
                  <span className="font-mono text-[10px] text-text-faint uppercase block mb-0.5">
                    Quant Lesson &amp; Architectural Pivot:
                  </span>
                  {entry.lesson}
                </div>
              </div>

              {entry.projectLink && (
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                  <Link
                    href={entry.projectLink}
                    className="text-accent hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>VIEW RELATED PROJECT TEARSHEET</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] text-text-faint">HONEST POST-MORTEM</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Research Notes Section */}
      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between font-mono">
          <div>
            <div className="text-xs font-bold text-accent uppercase tracking-wider">
              QUANTITATIVE RESEARCH NOTES
            </div>
            <div className="text-[11px] text-text-faint mt-0.5">
              Technical memos on execution, stochastic calculus, and machine learning calibration
            </div>
          </div>
          <Link
            href="/rss.xml"
            className="flex items-center gap-1.5 text-xs text-text-faint hover:text-accent transition-colors"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS FEED</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchNotesList.map((note) => (
            <article
              key={note.slug}
              className="terminal-panel p-5 bg-bg-elevated border border-border hover:border-accent transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-text-faint">
                  <span>{note.date}</span>
                  <span>{note.readTime}</span>
                </div>
                <h3 className="text-lg font-bold font-heading text-text group-hover:text-accent transition-colors leading-snug">
                  {note.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-sans">
                  {note.summary}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/40 font-mono text-xs">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-bg-inset border border-border text-[10px] text-text-faint"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-accent font-semibold text-[11px] flex items-center gap-1">
                  <span>READ NOTE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
