"use client";

import React from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { LiveTrackSection } from "@/components/live-track-section";
import { ResearchSection } from "@/components/research-section";
import { ExperienceSection } from "@/components/experience-section";
import { EducationSection } from "@/components/education-section";
import { ContactSection } from "@/components/contact-section";
import { useShell } from "@/components/terminal-shell";

export default function HomePage() {
  const { openMMGame, openPalette } = useShell();

  return (
    <div className="space-y-16 py-4">
      {/* 00 // HERO */}
      <HeroSection onOpenMMGame={openMMGame} onOpenPalette={openPalette} />

      {/* 01 // ABOUT & FACTSHEET */}
      <AboutSection />

      {/* 02 // PROJECTS & TEARSHEETS */}
      <ProjectsSection />

      {/* 03 // LIVE TRACK RECORD */}
      <LiveTrackSection />

      {/* 04 // RESEARCH & THE ANTI-PORTFOLIO */}
      <ResearchSection />

      {/* EXPERIENCE // TRADE BLOTTER */}
      <ExperienceSection />

      {/* 05 // EDUCATION & TRANSCRIPT */}
      <EducationSection />

      {/* 06 // CONTACT */}
      <ContactSection />
    </div>
  );
}
