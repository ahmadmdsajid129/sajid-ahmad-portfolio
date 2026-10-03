"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site";
import liveSignals from "@/data/live-signals.json";
import { ShieldCheck, Lock, Hash, CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { useToast } from "./toast-provider";

export function LiveTrackSection() {
  const { addToast } = useToast();
  const [inputSignal, setInputSignal] = useState(
    JSON.stringify(
      {
        date: "2026-10-03",
        strategy: "LOB_ADVERSE_SELECTION_V1",
        action: "PASSIVE_QUOTE_SKEW_BID",
        fairValue: 100.05,
      },
      null,
      2
    )
  );

  const [computedHash, setComputedHash] = useState("");
  const [targetHash, setTargetHash] = useState("");
  const [matchStatus, setMatchStatus] = useState<"idle" | "match" | "mismatch">("idle");

  const isLive = siteConfig.liveTrackRecordEnabled;

  const handleComputeHash = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputSignal.trim());
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      setComputedHash(hashHex);

      if (targetHash.trim()) {
        if (hashHex.toLowerCase() === targetHash.trim().toLowerCase()) {
          setMatchStatus("match");
          addToast("SHA-256 hash verified successfully!", "success", "CRYPTO");
        } else {
          setMatchStatus("mismatch");
          addToast("Hash mismatch detected.", "error", "VERIFY");
        }
      } else {
        setMatchStatus("idle");
        addToast("SHA-256 computed from signal JSON", "info", "HASH");
      }
    } catch (err) {
      addToast("Failed to compute SHA-256 hash", "error");
    }
  };

  const checklist = [
    { title: "Strategy Specification Selected", done: true, note: "Passive LOB MM with Adverse Selection" },
    { title: "Cryptographic Commitment Repo Configured", done: true, note: "Public Git with Signed Commits" },
    { title: "Daily Pre-Market Automation Workflow", done: false, note: "Scheduled GitHub Action (08:30 UTC)" },
    { title: "First Live Signal Audited", done: false, note: "Target: [[PLACEHOLDER: Go-Live Date]]" },
  ];

  return (
    <section id="live" className="pt-20 border-t border-border space-y-10">
      <div>
        <div className="section-label mb-2">03 // LIVE TRACK RECORD</div>
        <h2 className="text-3xl md:text-5xl font-bold font-heading text-text tracking-tight">
          FORWARD TEST <span className="text-accent">// CRYPTOGRAPHIC AUDIT</span>
        </h2>
        <p className="text-sm font-mono text-text-muted mt-2 max-w-2xl">
          Verifiable paper trading ledger. Ahead of the opening bell, signal payloads are hashed with SHA-256 and committed to a public repository to prevent retrospective curve-fitting.
        </p>
      </div>

      {/* When False (Default Honest Status Panel) */}
      {!isLive ? (
        <div className="terminal-panel p-6 bg-bg-elevated border border-border space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-warn animate-pulse" />
              <span className="font-bold text-sm text-text">
                FORWARD TEST: NOT YET STARTED
              </span>
              <span className="px-2 py-0.5 bg-bg-inset border border-border text-[10px] text-text-faint">
                HONESTY GUARANTEE
              </span>
            </div>
            <div className="text-[11px] text-text-faint">
              TARGET GO-LIVE: [[PLACEHOLDER: Q1 2027]]
            </div>
          </div>

          <div className="text-text-muted leading-relaxed text-[11px]">
            No live paper trades have been executed yet. In accordance with rule #1 (Rigor and honesty beat hype), this site will <strong>never present simulated backtests as live track records</strong>. The live tracking protocol is structured as follows:
          </div>

          {/* 4-Step Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-bg-inset border border-border rounded flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-faint">STAGE 0{idx + 1}</span>
                  {item.done ? (
                    <span className="text-up font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>DONE</span>
                    </span>
                  ) : (
                    <span className="text-text-faint font-semibold flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>PLANNED</span>
                    </span>
                  )}
                </div>
                <div className="font-semibold text-text text-[11px]">{item.title}</div>
                <div className="text-[10px] text-text-faint">{item.note}</div>
              </div>
            ))}
          </div>

          {/* Planned Strategy Architecture */}
          <div className="p-4 bg-bg-inset border border-border rounded space-y-2">
            <div className="text-accent font-bold text-[11px] uppercase">
              Planned Forward Test Methodology:
            </div>
            <p className="text-text-muted text-[11px] leading-relaxed">
              Every morning at 08:30 UTC (prior to continuous trading), the automated strategy emits a JSON signal payload containing target quote offsets, volatility forecasts, and execution boundaries. The file is hashed with SHA-256, committed to a public GitHub repository, and recorded immutably before order execution begins.
            </p>
          </div>
        </div>
      ) : (
        /* If Enabled: Live Blotter */
        <div className="terminal-panel p-6 bg-bg-elevated border border-border font-mono text-xs space-y-4">
          <div className="text-up font-bold">FORWARD TEST ACTIVE // PAPER TRADING</div>
          {/* Table of signals */}
        </div>
      )}

      {/* SHA-256 Web Crypto Verification Widget (Works in both states!) */}
      <div className="terminal-panel p-6 bg-bg-elevated border border-border font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="font-bold text-text uppercase">
              CRYPTOGRAPHIC SIGNAL VERIFIER (WEB CRYPTO API)
            </span>
          </div>
          <span className="text-[10px] text-text-faint">SHA-256 DIGEST</span>
        </div>

        <p className="text-[11px] text-text-muted">
          Paste any raw signal JSON string below to compute its mathematical SHA-256 fingerprint in your browser and verify against the committed ledger:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-text-faint">RAW SIGNAL PAYLOAD (JSON):</label>
            <textarea
              value={inputSignal}
              onChange={(e) => setInputSignal(e.target.value)}
              rows={6}
              className="w-full p-2.5 bg-bg-inset border border-border text-text font-mono text-xs rounded focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <label className="text-[10px] text-text-faint">TARGET HASH TO COMPARE (OPTIONAL):</label>
              <input
                type="text"
                value={targetHash}
                onChange={(e) => setTargetHash(e.target.value)}
                placeholder="Paste public commit SHA-256..."
                className="w-full p-2 bg-bg-inset border border-border text-text font-mono text-xs rounded focus:outline-none focus:border-accent"
              />
            </div>

            {computedHash && (
              <div className="p-3 bg-bg-inset border border-border rounded space-y-1">
                <div className="text-[10px] text-text-faint">COMPUTED SHA-256:</div>
                <div className="text-accent text-[11px] break-all font-bold">
                  {computedHash}
                </div>
                {matchStatus === "match" && (
                  <div className="text-up font-bold text-[10px] pt-1 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>CRYPTOGRAPHIC MATCH CONFIRMED</span>
                  </div>
                )}
                {matchStatus === "mismatch" && (
                  <div className="text-down font-bold text-[10px] pt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>HASH MISMATCH &mdash; PAYLOAD DOES NOT MATCH COMMIT</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleComputeHash}
              className="h-10 px-4 bg-accent text-bg font-bold rounded flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all"
            >
              <Hash className="w-4 h-4" />
              <span>COMPUTE &amp; VERIFY SHA-256 HASH</span>
            </button>
          </div>
        </div>

        <div className="text-[10px] text-text-faint pt-1 border-t border-border">
          *Paper trading results. Not investment advice. Cryptographic hashes ensure signal timestamps cannot be back-dated.
        </div>
      </div>
    </section>
  );
}
