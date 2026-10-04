"use client";

import React, { useState, createContext, useContext } from "react";
import { TickerTape } from "./ticker-tape";
import { Navbar } from "./navbar";
import { StatusBar } from "./status-bar";
import { CommandPalette } from "./command-palette";
import { HelpModal } from "./help-modal";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { BootSequence } from "./boot-sequence";
import { MarketMakerGame } from "./marketmaker-game";
import { CrtDegaussFlash } from "./crt-degauss-flash";

interface ShellContextType {
  openPalette: () => void;
  openHelp: () => void;
  openMMGame: () => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within TerminalShell");
  }
  return context;
}

interface TerminalShellProps {
  children: React.ReactNode;
}

export function TerminalShell({ children }: TerminalShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMMOpen, setIsMMOpen] = useState(false);

  const openPalette = () => setIsPaletteOpen(true);
  const openHelp = () => setIsHelpOpen(true);
  const openMMGame = () => setIsMMOpen(true);

  return (
    <ShellContext.Provider value={{ openPalette, openHelp, openMMGame }}>
      <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent selection:text-bg">
        <CrtDegaussFlash />
        <BootSequence />
        <TickerTape />
        <Navbar onOpenPalette={openPalette} />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12">
          {children}
        </main>
        <StatusBar />
        <CommandPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          onOpenHelp={openHelp}
          onOpenMMGame={openMMGame}
        />
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        <MarketMakerGame isOpen={isMMOpen} onClose={() => setIsMMOpen(false)} />
        <KeyboardShortcuts
          onOpenPalette={openPalette}
          onOpenHelp={openHelp}
        />
      </div>
    </ShellContext.Provider>
  );
}
