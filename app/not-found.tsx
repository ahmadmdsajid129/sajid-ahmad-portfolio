import React from "react";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center font-mono text-xs px-4">
      <div className="terminal-panel max-w-lg w-full p-8 bg-bg-elevated border border-border shadow-2xl space-y-6 text-center">
        <div className="flex items-center justify-center gap-2 text-down font-bold text-sm">
          <Terminal className="w-5 h-5" />
          <span>ERROR 404: INSTRUMENT NOT FOUND</span>
        </div>

        <div className="space-y-2 text-text-muted leading-relaxed">
          <p>
            The requested ticker or routing address does not exist in the active order book.
          </p>
          <div className="p-3 bg-bg-inset border border-border text-[11px] text-text-faint text-left font-mono">
            &gt; STATUS_CODE: 404_NOT_FOUND<br />
            &gt; SYMBOL_LOOKUP: NULL<br />
            &gt; ACTION: RE-ROUTING TO ORDER BOOK ENGINE
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-10 px-5 bg-accent text-bg font-bold rounded hover:brightness-110 active:scale-98 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO TERMINAL DASHBOARD</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
