"use client";

import React, { useEffect } from "react";
import { useTheme } from "./theme-provider";
import { useToast } from "./toast-provider";

interface KeyboardShortcutsProps {
  onOpenPalette: () => void;
  onOpenHelp: () => void;
}

const sectionIds = ["hero", "about", "projects", "live", "research", "education", "contact"];

export function KeyboardShortcuts({ onOpenPalette, onOpenHelp }: KeyboardShortcutsProps) {
  const { toggleTheme, togglePhosphor } = useTheme();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if target is an input/textarea/contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Command Palette (Cmd/Ctrl + K or /)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenPalette();
        return;
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onOpenPalette();
        return;
      }

      // Help Modal (?)
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onOpenHelp();
        return;
      }

      // Theme toggle (T)
      if (e.key.toLowerCase() === "t" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleTheme();
        addToast("Theme toggled via [T]", "info", "THEME");
        return;
      }

      // Phosphor mode toggle (P)
      if (e.key.toLowerCase() === "p" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        togglePhosphor();
        addToast("Phosphor mode toggled via [P]", "success", "CRT");
        return;
      }

      // Number keys 1-7 to jump to sections
      if (/^[1-7]$/.test(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        const targetId = sectionIds[index];
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth" });
            addToast(`Jumped to section: ${targetId.toUpperCase()}`, "info", `SEC-${e.key}`);
          }
        }
        return;
      }

      // J / K for Next / Prev Section
      if (e.key.toLowerCase() === "j" || e.key.toLowerCase() === "k") {
        const isNext = e.key.toLowerCase() === "j";
        const scrollPos = window.scrollY + 300;

        let currentIndex = 0;
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el && el.offsetTop <= scrollPos) {
            currentIndex = i;
            break;
          }
        }

        const nextIndex = isNext
          ? Math.min(currentIndex + 1, sectionIds.length - 1)
          : Math.max(currentIndex - 1, 0);

        const targetEl = document.getElementById(sectionIds[nextIndex]);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenPalette, onOpenHelp, toggleTheme, togglePhosphor, addToast]);

  return null;
}
