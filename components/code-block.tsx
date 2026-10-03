"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

export function CodeBlock({ code, language = "python", label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-panel my-4 overflow-hidden border border-border bg-bg-inset font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-elevated text-text-faint text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-accent font-semibold">{label || language.toUpperCase()}</span>
          <span className="text-[10px] text-text-faint">ILLUSTRATIVE SNIPPET</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-accent text-text-muted transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-up" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[10px]">{copied ? "COPIED" : "COPY"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-text leading-relaxed text-[12px] bg-bg-inset">
        <code>{code}</code>
      </pre>
    </div>
  );
}
