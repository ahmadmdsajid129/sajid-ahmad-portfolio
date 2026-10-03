"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";
import { useTheme } from "./theme-provider";
import { useToast } from "./toast-provider";
import { Sun, Moon, Terminal as TerminalIcon, Menu, X, ArrowDown } from "lucide-react";

interface NavItem {
  id: string;
  code: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "about", code: "01", label: "ABOUT", href: "#about" },
  { id: "projects", code: "02", label: "PROJECTS", href: "#projects" },
  { id: "research", code: "03", label: "RESEARCH", href: "#research" },
  { id: "education", code: "04", label: "EDUCATION", href: "#education" },
  { id: "contact", code: "05", label: "CONTACT", href: "#contact" },
];

interface NavbarProps {
  onOpenPalette?: () => void;
}

export function Navbar({ onOpenPalette }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState<string>("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track active section and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Check current section
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const handleResumeDownload = () => {
    addToast("Resume downloading...", "info", "CV");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-14 bg-bg/85 backdrop-blur-md hairline-b transition-colors duration-200">
        <div className="max-w-[1200px] h-full mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left: Wordmark > SAJID | QUANT█ */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex items-center font-mono text-sm tracking-wider font-bold text-text hover:text-accent transition-colors"
          >
            <span className="text-text-faint">&gt; </span>
            <span className="text-accent font-bold">SAJID</span>
            <span className="text-text-faint mx-2 text-xs font-normal">|</span>
            <span className="text-text">QUANT</span>
            <span className="inline-block w-2 h-3.5 bg-accent ml-1.5 animate-blink" />
          </button>

          {/* Center (Desktop Nav) */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-[13px]">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 flex items-center gap-1.5 transition-colors ${
                    isActive ? "text-accent font-semibold" : "text-text-muted hover:text-text"
                  }`}
                >
                  <span className="text-text-faint text-[11px]">{item.code}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenPalette}
              title="Open command palette (Ctrl+K or /)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-bg-elevated border border-border hover:border-accent text-text-muted hover:text-text rounded transition-colors"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-accent" />
              <span>⌘K</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch theme (current: ${theme}, key: T)`}
              className="p-1.5 text-text-muted hover:text-accent border border-border bg-bg-elevated hover:border-border-strong rounded transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "paper" ? (
                <Moon className="w-4 h-4 stroke-[1.5]" />
              ) : theme === "phosphor" ? (
                <TerminalIcon className="w-4 h-4 text-accent stroke-[1.5]" />
              ) : (
                <Sun className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>

            {/* Resume Button */}
            <a
              href={siteConfig.resumeUrl}
              download
              onClick={handleResumeDownload}
              className="hidden md:inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-mono font-semibold text-accent border border-accent bg-transparent hover:bg-accent hover:text-bg transition-all duration-150 rounded active:scale-98"
            >
              <span>RESUME</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-text border border-border bg-bg-elevated rounded"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 2px amber scroll-progress bar on navbar's bottom edge */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Mobile Full-Screen Terminal Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 z-50 bg-bg/98 backdrop-blur-xl lg:hidden flex flex-col justify-between p-6 border-t border-border"
          >
            <div className="flex flex-col gap-4 font-mono mt-4">
              <div className="text-xs text-text-faint border-b border-border pb-2">
                &gt; TERMINAL DIRECTORY
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-lg border-b border-border/40 text-text hover:text-accent transition-colors"
                >
                  <span className="text-sm text-text-faint">{item.code} //</span>
                  <span className="font-semibold tracking-wide">{item.label}</span>
                  <span className="text-xs text-accent">GO &rarr;</span>
                </Link>
              ))}

              <a
                href={siteConfig.resumeUrl}
                download
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleResumeDownload();
                }}
                className="mt-4 flex items-center justify-center gap-2 h-11 text-xs font-mono font-bold text-bg bg-accent rounded"
              >
                <span>DOWNLOAD RESUME (PDF)</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            <div className="border-t border-border pt-4 font-mono text-xs text-text-muted flex justify-between items-center">
              <span>STATUS: OPEN FOR ROLES</span>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                GITHUB &nearr;
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
