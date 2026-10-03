import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { ArrowRight, Terminal, Shield, Zap, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-24 py-8">
      {/* 00 // HERO SECTION ANCHOR */}
      <section id="hero" className="min-h-[75vh] flex flex-col justify-center pt-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-bg-elevated border border-border text-accent text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>QUANTITATIVE RESEARCH // MARKET MICROSTRUCTURE // DERIVATIVES PRICING // ML SYSTEMS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.08]">
            I turn noisy data into <span className="text-accent underline decoration-accent/40 underline-offset-8">testable edges.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-2xl font-normal leading-relaxed">
            {siteConfig.pitch}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="h-12 px-6 bg-accent text-bg font-mono font-bold text-xs flex items-center gap-2 rounded hover:brightness-110 transition-all shadow-lg"
            >
              <span>VIEW PROJECTS</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={siteConfig.resumeUrl}
              download
              className="h-12 px-6 bg-bg-elevated border border-accent text-accent font-mono font-bold text-xs flex items-center gap-2 rounded hover:bg-accent/10 transition-all"
            >
              <span>DOWNLOAD RESUME &darr;</span>
            </a>

            <span className="text-xs font-mono text-text-faint">
              or press <kbd className="px-1.5 py-0.5 bg-bg-elevated border border-border text-accent">⌘K</kbd> to navigate like a terminal
            </span>
          </div>
        </div>
      </section>

      {/* 01 // ABOUT SECTION ANCHOR */}
      <section id="about" className="pt-16 border-t border-border/50">
        <div className="section-label mb-2">01 // ABOUT</div>
        <h2 className="text-2xl font-bold font-heading text-text">PROFILE // DES &lt;GO&gt;</h2>
        <p className="text-sm font-mono text-text-faint mt-1">Foundational section placeholder (Detailed in Phase 5)</p>
      </section>

      {/* 02 // PROJECTS SECTION ANCHOR */}
      <section id="projects" className="pt-16 border-t border-border/50">
        <div className="section-label mb-2">02 // PROJECTS</div>
        <h2 className="text-2xl font-bold font-heading text-text">RESEARCH &amp; BUILDS // TEARSHEETS</h2>
        <p className="text-sm font-mono text-text-faint mt-1">Flagship models &amp; pricing engines (Detailed in Phase 3)</p>
      </section>

      {/* 03 // LIVE TRACK RECORD SECTION ANCHOR */}
      <section id="live" className="pt-16 border-t border-border/50">
        <div className="section-label mb-2">03 // LIVE TRACK</div>
        <h2 className="text-2xl font-bold font-heading text-text">FORWARD TEST // CRYPTOGRAPHIC LEDGER</h2>
        <p className="text-sm font-mono text-text-faint mt-1">Paper trading verification &amp; SHA-256 proofs (Detailed in Phase 5)</p>
      </section>

      {/* 04 // RESEARCH & ANTI-PORTFOLIO SECTION ANCHOR */}
      <section id="research" className="pt-16 border-t border-border/50">
        <div className="section-label mb-2">04 // RESEARCH</div>
        <h2 className="text-2xl font-bold font-heading text-text">THE ANTI-PORTFOLIO // WHAT FAILED</h2>
        <p className="text-sm font-mono text-text-faint mt-1">Post-mortems on execution frictions and failed hypotheses (Detailed in Phase 5)</p>
      </section>

      {/* 05 // EDUCATION SECTION ANCHOR */}
      <section id="education" className="pt-16 border-t border-border/50">
        <div className="section-label mb-2">05 // EDUCATION</div>
        <h2 className="text-2xl font-bold font-heading text-text">ACADEMIC RECORD &amp; COURSEWORK</h2>
        <p className="text-sm font-mono text-text-faint mt-1">Mathematics, Computer Science, and Quant coursework (Detailed in Phase 5)</p>
      </section>

      {/* 06 // CONTACT SECTION ANCHOR */}
      <section id="contact" className="pt-16 border-t border-border/50">
        <div className="section-label mb-2">06 // CONTACT</div>
        <h2 className="text-2xl font-bold font-heading text-text">LET&apos;S TALK // OPEN TO WORK</h2>
        <p className="text-sm font-mono text-text-faint mt-1">Direct message &amp; cryptographically secured contact (Detailed in Phase 5)</p>
      </section>
    </div>
  );
}
