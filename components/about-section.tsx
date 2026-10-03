"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site";
import { skillsData, SkillFactor } from "@/data/skills";
import { useToast } from "./toast-provider";
import {
  User,
  Target,
  ArrowRight,
  Copy,
  Check,
  Code,
  Sliders,
  Sparkles,
  Layers,
} from "lucide-react";

export function AboutSection() {
  const { addToast } = useToast();
  const [skillView, setSkillView] = useState<"BARS" | "HEATMAP">("BARS");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    const rawEmail = siteConfig.email.replace("[[PLACEHOLDER: ", "").replace("]]", "");
    navigator.clipboard.writeText(rawEmail);
    setCopiedEmail(true);
    addToast("Email copied to clipboard", "success", "MAIL");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const researchSteps = [
    {
      num: "01",
      step: "Hypothesis",
      desc: "Formulate an economically grounded inefficiency or structural pricing anomaly before touching price series.",
    },
    {
      num: "02",
      step: "Data & Cleansing",
      desc: "Strict chronological temporal alignment with zero look-ahead leakage and survivorship-bias filtering.",
    },
    {
      num: "03",
      step: "Execution Backtest",
      desc: "Simulate real exchange frictions: spread crossing, taker fees, market-impact decay, and queue position.",
    },
    {
      num: "04",
      step: "Stress & Chaos",
      desc: "Simulate liquidity dry-ups, toxic informed order flow bursts, parameter perturbation, and regime shifts.",
    },
    {
      num: "05",
      step: "Forward Paper Test",
      desc: "Commit daily encrypted signal hashes to a public ledger prior to the market open for tamper-proof verification.",
    },
  ];

  const skillCategories = [
    "Quant & Math",
    "Machine Learning",
    "Engineering",
    "Financial Systems",
  ] as const;

  return (
    <section id="about" className="pt-20 border-t border-border space-y-16">
      {/* 1. Header & DES <GO> Factsheet */}
      <div>
        <div className="section-label mb-2">01 | ABOUT</div>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
          PROFILE <span className="text-accent">| DES &lt;GO&gt;</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (7 cols): Narrative, Pull Quote, Stepper */}
        <div className="lg:col-span-7 space-y-6 text-sm text-text-muted leading-relaxed">
          <p>
            I am a quantitative researcher and software engineer focused on market microstructure,
            derivatives pricing kernels, and resilient applied machine learning systems. My work
            bridges statistical rigor and production engineering: writing vectorized numerical
            kernels that execute under strict latency constraints, stress-testing execution
            frictions, and building transparent forensic risk engines.
          </p>

          <p>
            My research philosophy is strictly <strong>hypothesis-first and friction-aware</strong>.
            I treat high in-sample Sharpe ratios with extreme skepticism. In market microstructure,
            a statistical edge is meaningless if crossing the bid-ask spread or suffering adverse
            selection destroys expected return. Every model I build is subjected to chronological
            out-of-sample stress testing, realistic fill penalties, and probability calibration.
          </p>

          <p>
            I am seeking <strong>quantitative research, algorithmic trading, or quant developer</strong>{" "}
            roles at systematic funds, market makers, or proprietary trading desks where mathematical
            honesty and robust systems architecture drive performance.
          </p>

          {/* Amber-bordered pull quote */}
          <div className="terminal-panel p-4 bg-bg-elevated border-l-4 border-l-accent border-border italic text-text font-serif text-base sm:text-lg">
            &ldquo;If a backtest looks too good to be true, assume I made an error in the execution model.&rdquo;
          </div>

          {/* 5-Step "How I Research" Stepper */}
          <div className="pt-4 space-y-3 font-mono">
            <div className="text-xs font-bold text-accent uppercase tracking-wider">
              HOW I RESEARCH | 5-STAGE PIPELINE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              {researchSteps.map((s, idx) => (
                <div
                  key={s.num}
                  className="p-3 bg-bg-inset border border-border rounded flex flex-col justify-between group hover:border-accent transition-colors"
                >
                  <div>
                    <div className="text-[10px] text-text-faint">{s.num} |</div>
                    <div className="font-bold text-text group-hover:text-accent mt-0.5">
                      {s.step}
                    </div>
                  </div>
                  <div className="text-[10px] text-text-faint mt-2 leading-relaxed">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Factsheet Table & Profile Tile */}
        <div className="lg:col-span-5 space-y-6">
          {/* Factsheet Blotter */}
          <div className="terminal-panel p-5 bg-bg-elevated border border-border font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-accent uppercase">RESEARCHER FACTSHEET</span>
              <span className="text-[10px] text-text-faint">BLOOMBERG DES</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-faint">NAME</span>
                <span className="text-text font-semibold">{siteConfig.name.replace("[[PLACEHOLDER: ", "").replace("]]", "")}</span>
              </div>

              <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-faint">FOCUS</span>
                <span className="text-text text-right text-[11px]">
                  Microstructure &middot; Derivatives &middot; ML Risk
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-faint">LANGUAGES</span>
                <span className="text-accent text-right">
                  Python &middot; SQL &middot; TypeScript &middot; C++
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-faint">CORE STACK</span>
                <span className="text-text text-right text-[11px]">
                  NumPy &middot; Pandas &middot; XGBoost &middot; FastAPI &middot; Next.js
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-faint">LOCATION</span>
                <span className="text-text text-right">{siteConfig.location}</span>
              </div>

              <div className="flex items-baseline justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-faint">STATUS</span>
                <span className="text-up font-bold text-right flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-up rounded-full animate-pulse" />
                  <span>OPEN TO WORK</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-text-faint">EMAIL</span>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 text-accent hover:brightness-125 text-[11px] transition-all"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-up" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedEmail ? "COPIED" : "CLICK TO COPY"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grayscale Profile Tile with Color on Hover */}
          <div className="terminal-panel p-4 bg-bg-inset border border-border flex items-center gap-4">
            <div className="w-20 h-20 bg-bg-elevated border border-border rounded relative overflow-hidden flex items-center justify-center group cursor-pointer shrink-0">
              {/* Profile Avatar / Monogram */}
              <div className="font-mono text-sm font-bold text-accent group-hover:scale-105 transition-transform tracking-wider">
                SAJID
              </div>
              <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
            </div>
            <div className="font-mono text-xs space-y-1">
              <div className="text-text font-bold">{siteConfig.name}</div>
              <div className="text-text-faint text-[10px]">
                Quantitative Research &middot; Systems Architecture
              </div>
              <div className="text-[10px] text-accent pt-1">
                Available: {siteConfig.availableFrom}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Skills as Factor Exposures */}
      <div className="space-y-6 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-xs font-bold text-accent uppercase tracking-wider">
              QUANTITATIVE SKILLS | FACTOR EXPOSURES
            </div>
            <div className="text-[11px] text-text-faint mt-0.5">
              Empirical competencies mapped to real codebase implementations
            </div>
          </div>

          {/* BARS | HEATMAP Toggle */}
          <div className="flex items-center bg-bg-elevated border border-border p-0.5 rounded text-xs">
            <button
              onClick={() => setSkillView("BARS")}
              className={`px-3 py-1 font-semibold text-[11px] rounded ${
                skillView === "BARS" ? "bg-accent text-bg" : "text-text-muted hover:text-text"
              }`}
            >
              BARS
            </button>
            <button
              onClick={() => setSkillView("HEATMAP")}
              className={`px-3 py-1 font-semibold text-[11px] rounded ${
                skillView === "HEATMAP" ? "bg-accent text-bg" : "text-text-muted hover:text-text"
              }`}
            >
              HEATMAP
            </button>
          </div>
        </div>

        {/* Skill Exposures Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category) => {
            const categorySkills = skillsData.filter((s) => s.category === category);
            return (
              <div
                key={category}
                className="terminal-panel p-4 bg-bg-elevated border border-border space-y-3 font-mono text-xs"
              >
                <div className="font-bold text-text uppercase text-[11px] border-b border-border pb-1 text-accent flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[10px] text-text-faint">{categorySkills.length} FACTORS</span>
                </div>

                {skillView === "BARS" ? (
                  <div className="space-y-2.5">
                    {categorySkills.map((skill) => (
                      <div key={skill.name} className="space-y-1 group">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-text group-hover:text-accent transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-text-faint tabular-nums text-[10px]">
                            {skill.exposure}%
                          </span>
                        </div>
                        {/* Horizontal Bar */}
                        <div className="h-1.5 w-full bg-bg-inset border border-border rounded overflow-hidden relative">
                          <div
                            className="h-full bg-accent/80 group-hover:bg-accent transition-all duration-300"
                            style={{ width: `${skill.exposure}%` }}
                          />
                        </div>
                        {/* Evidence tooltip */}
                        <div className="text-[9px] text-text-faint truncate hidden group-hover:block transition-all">
                          &rarr; {skill.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Heatmap Grid View */
                  <div className="grid grid-cols-2 gap-2">
                    {categorySkills.map((skill) => {
                      const opacity = skill.exposure / 100;
                      return (
                        <div
                          key={skill.name}
                          className="p-2 border border-border rounded text-[10px] space-y-1 hover:border-accent transition-colors"
                          style={{
                            backgroundColor: `rgba(255, 176, 0, ${opacity * 0.15})`,
                          }}
                        >
                          <div className="font-semibold text-text leading-tight">{skill.name}</div>
                          <div className="text-accent font-bold tabular-nums">
                            Exp: {skill.exposure}%
                          </div>
                          <div className="text-[9px] text-text-faint truncate">
                            {skill.evidence.split("(")[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-text-faint">
          *Self-assessed factor exposures. Hover on any factor to view the verifiable project implementation.
        </div>
      </div>
    </section>
  );
}
