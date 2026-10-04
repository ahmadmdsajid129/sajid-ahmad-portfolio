"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { useToast } from "./toast-provider";
import { sound } from "@/lib/sound";
import { ArrowUp, Terminal, Github, Linkedin, Mail, FileText, Rss } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const { addToast } = useToast();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    sound?.playSectionTick();
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -70;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        window.history.pushState(null, "", `/#${id}`);
      }
    }
  };

  const handleVersionClick = () => {
    addToast(
      "AGY-QUANT-TERMINAL :: BUILD 2026.10.03 | ZERO LEAKAGE | STRICT OOS",
      "success",
      "v1.0.0"
    );
  };

  return (
    <footer className="w-full bg-bg-inset hairline-t font-mono text-xs text-text-muted mt-20 pb-12 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
        {/* 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Wordmark & Back to Top */}
          <div className="space-y-4">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  scrollToTop();
                  window.history.pushState(null, "", "/");
                }
              }}
              className="flex items-center text-sm font-bold text-text font-mono hover:text-accent transition-colors"
            >
              <span className="text-text-faint">&gt; </span>
              <span className="text-accent font-bold">SAJID</span>
              <span className="text-text-faint mx-2 text-xs font-normal">|</span>
              <span className="text-text">QUANT</span>
              <span className="inline-block w-2 h-3.5 bg-accent ml-1.5 animate-blink" />
            </Link>
            <p className="text-text-muted leading-relaxed max-w-xs">
              Quantitative research, market microstructure models, and high-throughput risk engines.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-accent hover:brightness-125 pt-2 transition-all"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Col 2: Navigate with Function Codes */}
          <div className="space-y-3">
            <div className="text-text font-bold uppercase tracking-wider text-[11px] text-accent">
              Directory | GO
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#about"
                  onClick={(e) => handleNavClick(e, "about")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-text-faint">01</span>
                  <span>ABOUT &lt;DES&gt;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  onClick={(e) => handleNavClick(e, "projects")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-text-faint">02</span>
                  <span>PROJECTS &lt;TEARSHEETS&gt;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#experience"
                  onClick={(e) => handleNavClick(e, "experience")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-text-faint">03</span>
                  <span>EXPERIENCE &lt;TIMELINE&gt;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#education"
                  onClick={(e) => handleNavClick(e, "education")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-text-faint">04</span>
                  <span>EDUCATION &lt;TRANSCRIPT&gt;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-text-faint">05</span>
                  <span>CONTACT &lt;MSG&gt;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Elsewhere */}
          <div className="space-y-3">
            <div className="text-text font-bold uppercase tracking-wider text-[11px] text-accent">
              Elsewhere
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Github className="w-3.5 h-3.5 text-text-faint" />
                  <span>github.com/ahmadmdsajid129</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-3.5 h-3.5 text-text-faint" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-text-faint" />
                  <span>Direct Researcher Email</span>
                </a>
              </li>
              <li>
                <a
                  href="/resume"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-text-faint" />
                  <span>Web Resume (HTML CV)</span>
                </a>
              </li>
              <li>
                <a
                  href="/rss.xml"
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Rss className="w-3.5 h-3.5 text-text-faint" />
                  <span>RSS Research Feed</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Boxed Risk Disclaimer */}
          <div className="space-y-2">
            <div className="text-text font-bold uppercase tracking-wider text-[11px] text-warn">
              Hypothetical Disclaimer
            </div>
            <div className="p-3 bg-bg-elevated border border-border text-[11px] leading-relaxed text-text-faint">
              This site is for informational and technical demonstration purposes. Backtests,
              simulations, and paper-trading metrics are strictly hypothetical and do not constitute
              investment advice. Project data is synthetic unless explicitly marked as verified
              market or client data.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-text-faint">
          <div>
            &copy; 2026 {siteConfig.name} &middot; Built with Next.js 14, TypeScript &amp; Tailwind CSS
          </div>
          <div className="flex items-center gap-3">
            <span>Last deployed: {siteConfig.buildDate}</span>
            <span>&middot;</span>
            <button
              onClick={handleVersionClick}
              className="text-accent hover:brightness-125 focus:outline-none transition-all"
              title="Click for build verification banner"
            >
              v{siteConfig.version}
            </button>
            <span>&middot;</span>
            <span>Press ⌘K for commands</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
