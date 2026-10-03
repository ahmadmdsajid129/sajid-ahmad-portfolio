"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Play, Pause, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { GlossaryTooltip } from "./glossary-tooltip";

interface MMState {
  midPrice: number;
  myBid: number;
  myAsk: number;
  inventory: number;
  cash: number;
  pnl: number;
  tradesCount: number;
  adverseSelectionCount: number;
  lastFill: "none" | "buy" | "sell";
}

interface MarketMakerGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarketMakerGame({ isOpen, onClose }: MarketMakerGameProps) {
  const [halfSpread, setHalfSpread] = useState(0.1);
  const [inventorySkew, setInventorySkew] = useState(0.5);
  const [isRunning, setIsRunning] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [state, setState] = useState<MMState>({
    midPrice: 100.0,
    myBid: 99.9,
    myAsk: 100.1,
    inventory: 0,
    cash: 0,
    pnl: 0,
    tradesCount: 0,
    adverseSelectionCount: 0,
    lastFill: "none",
  });

  const workerRef = useRef<Worker | null>(null);

  // Initialize Worker
  useEffect(() => {
    if (!isOpen) return;

    try {
      const worker = new Worker(
        new URL("../workers/marketmaker.worker.ts", import.meta.url),
        { type: "module" }
      );

      worker.onmessage = (e: MessageEvent) => {
        if (e.data.type === "MM_STATE") {
          setState(e.data.payload);
        }
      };

      worker.postMessage({ action: "START" });
      worker.postMessage({
        action: "UPDATE_CONFIG",
        payload: { halfSpread, inventorySkew },
      });

      workerRef.current = worker;
    } catch (err) {
      console.warn("Market maker worker fallback", err);
    }

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden && workerRef.current) {
        workerRef.current.postMessage({ action: "STOP" });
        setIsRunning(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (workerRef.current) {
        workerRef.current.postMessage({ action: "STOP" });
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [isOpen]);

  // Update worker config on slider change
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        action: "UPDATE_CONFIG",
        payload: { halfSpread, inventorySkew },
      });
    }
  }, [halfSpread, inventorySkew]);

  const toggleRun = () => {
    if (!workerRef.current) return;
    if (isRunning) {
      workerRef.current.postMessage({ action: "STOP" });
      setIsRunning(false);
    } else {
      workerRef.current.postMessage({ action: "START" });
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: "RESET" });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono"
      onClick={onClose}
    >
      <div
        className="terminal-panel max-w-2xl w-full p-6 bg-bg-elevated border border-border shadow-2xl space-y-6 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-bold text-sm text-text">
              MARKET MAKER SIMULATOR | ADVERSE SELECTION TEST
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="text-[11px] text-accent hover:brightness-125 transition-all"
            >
              {showHowItWorks ? "HIDE NOTES" : "HOW IT WORKS"}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-text-faint hover:text-accent border border-border rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How It Works Explainer Callout */}
        {showHowItWorks && (
          <div className="p-3 bg-bg-inset border border-accent/40 rounded space-y-2 text-[11px] text-text-muted leading-relaxed">
            <div className="text-accent font-bold">MICROSTRUCTURE MECHANICS &amp; ASYMMETRY</div>
            <p>
              In naive backtests, market makers assume passive limit orders earn the half-spread on
              every trade. In reality, <strong className="text-text">informed traders</strong> only
              trade against you when they know the price is about to shift against your inventory.
            </p>
            <p>
              This simulator mirrors the <strong className="text-text">PRJ-001</strong> model: naive
              quoting yields severe losses during toxic flow bursts. Increasing your{" "}
              <strong className="text-accent">Inventory Skew</strong> automatically shades quotes
              downward when long (or upward when short) to actively shed unwanted inventory before
              the adverse selection penalty compounds.
            </p>
          </div>
        )}

        {/* Live Metrics Blotter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
          <div className="p-2.5 bg-bg-inset border border-border rounded">
            <div className="text-[10px] text-text-faint uppercase">Mark-to-Market P&amp;L</div>
            <div
              className={`text-xl font-bold ${
                state.pnl > 0 ? "text-up" : state.pnl < 0 ? "text-down" : "text-text"
              }`}
            >
              {state.pnl >= 0 ? `+$${state.pnl.toFixed(2)}` : `-$${Math.abs(state.pnl).toFixed(2)}`}
            </div>
          </div>

          <div className="p-2.5 bg-bg-inset border border-border rounded">
            <div className="text-[10px] text-text-faint uppercase">Current Inventory</div>
            <div
              className={`text-xl font-bold ${
                state.inventory > 0 ? "text-up" : state.inventory < 0 ? "text-down" : "text-text"
              }`}
            >
              {state.inventory > 0 ? `+${state.inventory}` : state.inventory}
            </div>
            <div className="text-[9px] text-text-faint">
              {state.inventory > 0 ? "LONG BIAS" : state.inventory < 0 ? "SHORT BIAS" : "FLAT"}
            </div>
          </div>

          <div className="p-2.5 bg-bg-inset border border-border rounded">
            <div className="text-[10px] text-text-faint uppercase">Fills / Toxic Hits</div>
            <div className="text-xl font-bold text-text">
              {state.tradesCount}{" "}
              <span className="text-xs text-down font-normal">({state.adverseSelectionCount})</span>
            </div>
            <div className="text-[9px] text-text-faint">Fills (Adverse fills)</div>
          </div>

          <div className="p-2.5 bg-bg-inset border border-border rounded">
            <div className="text-[10px] text-text-faint uppercase">Mid / Quotes</div>
            <div className="text-sm font-bold text-text">{state.midPrice.toFixed(2)}</div>
            <div className="text-[10px] text-text-muted">
              <span className="text-up font-semibold">{state.myBid.toFixed(2)}</span> &times;{" "}
              <span className="text-down font-semibold">{state.myAsk.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sliders Control Panel */}
        <div className="space-y-4 p-4 bg-bg-inset border border-border rounded">
          {/* Half Spread Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <span className="text-text-muted">
                QUOTED HALF-SPREAD: <span className="text-accent font-bold">${halfSpread.toFixed(2)}</span>
              </span>
              <span className="text-text-faint text-[10px]">
                {halfSpread < 0.08 ? "Tight (High fill rate, high toxic risk)" : "Wide (Low fill rate)"}
              </span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.40"
              step="0.01"
              value={halfSpread}
              onChange={(e) => setHalfSpread(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          {/* Inventory Skew Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <div className="flex items-center gap-1">
                <GlossaryTooltip term="Adverse selection">
                  <span className="text-text-muted">INVENTORY SKEW COEFFICIENT:</span>
                </GlossaryTooltip>
                <span className="text-accent font-bold">{inventorySkew.toFixed(1)}x</span>
              </div>
              <span className="text-text-faint text-[10px]">
                {inventorySkew === 0 ? "No inventory penalty (Naive)" : "Avellaneda-Stoikov Skew"}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={inventorySkew}
              onChange={(e) => setInventorySkew(parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>
        </div>

        {/* Bottom Action Strip */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRun}
              className="px-3 py-1.5 bg-accent text-bg font-bold rounded flex items-center gap-1.5 hover:brightness-110 active:scale-98"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? "PAUSE" : "RESUME"}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-bg-inset border border-border text-text-muted hover:text-text rounded flex items-center gap-1.5 active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>

          <div className="text-[10px] text-text-faint">
            TICKING REAL-TIME | WEB WORKER ENGINE
          </div>
        </div>
      </div>
    </div>
  );
}
