"use client";

import React, { useState } from "react";
import { TickerTape } from "./ticker-tape";
import { Navbar } from "./navbar";
import { StatusBar } from "./status-bar";
import { CommandPalette } from "./command-palette";
import { HelpModal } from "./help-modal";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { BootSequence } from "./boot-sequence";

interface TerminalShellProps {
  children: React.ReactNode;
}

export function TerminalShell({ children }: TerminalShellProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent selection:text-bg">
      <BootSequence />
      <TickerTape />
      <Navbar onOpenPalette={() => setIsPaletteOpen(true)} />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12">
        {children}
      </main>
      <StatusBar />
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <KeyboardShortcuts
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />
    </div>
  );
}
