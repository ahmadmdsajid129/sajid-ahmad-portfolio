"use client";

import React from "react";
import { HeroSection } from "@/components/hero-section";
import { useShell } from "@/components/terminal-shell";

export default function HomePage() {
  const { openMMGame, openPalette } = useShell();

  return (
    <div className="space-y-24 py-4">
      {/* 00 // HERO SECTION */}
      <HeroSection onOpenMMGame={openMMGame} onOpenPalette={openPalette} />

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
