"use client";

import React from "react";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { EducationSection } from "@/components/education-section";
import { ContactSection } from "@/components/contact-section";
import { useShell } from "@/components/terminal-shell";

export default function HomePage() {
  const { openMMGame, openPalette } = useShell();

  React.useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };

    scrollToHash();
    const timer = setTimeout(scrollToHash, 150);

    window.addEventListener("hashchange", scrollToHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="space-y-16 py-4">
      {/* 00 | HERO */}
      <HeroSection onOpenMMGame={openMMGame} onOpenPalette={openPalette} />

      {/* 01 | ABOUT & FACTSHEET */}
      <AboutSection />

      {/* 02 | PROJECTS & TEARSHEETS */}
      <ProjectsSection />

      {/* 03 | EXPERIENCE & TIMELINE */}
      <ExperienceSection />

      {/* 04 | EDUCATION & TRANSCRIPT */}
      <EducationSection />

      {/* 05 | CONTACT */}
      <ContactSection />
    </div>
  );
}
