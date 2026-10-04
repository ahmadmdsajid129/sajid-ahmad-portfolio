"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { useToast } from "./toast-provider";
import { sound } from "@/lib/sound";

interface KeyboardShortcutsProps {
  onOpenPalette: () => void;
  onOpenHelp: () => void;
}

const sectionIds = ["hero", "about", "projects", "experience", "education", "contact"];

export function KeyboardShortcuts({ onOpenPalette, onOpenHelp }: KeyboardShortcutsProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
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

      // Audio mute toggle (M)
      if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const isMuted = sound?.toggleMute();
        addToast(isMuted ? "Mechanical audio MUTED [M]" : "Mechanical audio ENABLED [M]", "info", "SND");
        return;
      }

      // Number keys 1-6 to jump to sections
      if (/^[1-6]$/.test(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        const targetId = sectionIds[index];
        if (targetId) {
          sound?.playSectionTick();
          const el = document.getElementById(targetId);
          if (el) {
            e.preventDefault();
            const yOffset = -70;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            window.history.pushState(null, "", `/#${targetId}`);
            addToast(`Jumped to section: ${targetId.toUpperCase()}`, "info", `SEC-${e.key}`);
          } else {
            router.push(`/#${targetId}`);
            addToast(`Navigating to section: ${targetId.toUpperCase()}`, "info", `SEC-${e.key}`);
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
          sound?.playSectionTick();
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Authentic Cherry MX Blue / Typewriter sound on any active input, textarea, or contenteditable
    const handleGlobalTypingSound = (e: KeyboardEvent) => {
      if (
        [
          "Control",
          "Alt",
          "Shift",
          "Meta",
          "CapsLock",
          "Tab",
          "Escape",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ].includes(e.key)
      ) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        sound?.playKeyClick(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleGlobalTypingSound, { capture: true, passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleGlobalTypingSound, { capture: true });
    };
  }, [onOpenPalette, onOpenHelp, theme, toggleTheme, addToast]);

  return null;
}
