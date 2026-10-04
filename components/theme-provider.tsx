"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "paper" | "phosphor";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  togglePhosphor: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "paper" || stored === "phosphor" || stored === "dark") {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const initialTheme: Theme = prefersLight ? "paper" : "dark";
        setThemeState(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
      }
    } catch {
      // Fallback in case of restricted environment
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    const isActivatingPhosphor = newTheme === "phosphor" && theme !== "phosphor";
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // Ignore localStorage errors
    }
    if (newTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
    if (isActivatingPhosphor && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("trigger-crt-degauss"));
    }
  };

  const toggleTheme = () => {
    if (theme === "phosphor") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("paper");
    } else {
      setTheme("dark");
    }
  };

  const togglePhosphor = () => {
    if (theme === "phosphor") {
      setTheme("dark");
    } else {
      setTheme("phosphor");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, togglePhosphor }}>
      {/* Prevent flash of wrong theme before mounted */}
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
