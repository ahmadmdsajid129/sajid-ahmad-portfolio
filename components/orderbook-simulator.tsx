"use client";

import React, { useEffect, useState, useRef } from "react";
import { BookSnapshot, PriceLevel } from "@/workers/orderbook.worker";
import { GlossaryTooltip } from "./glossary-tooltip";
import {
  Play,
  Pause,
  RefreshCw,
  BarChart2,
  Activity,
  Cpu,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";

interface OrderBookSimulatorProps {
  onOpenMMGame?: () => void;
}

// Initial deterministic fallback snapshot for SSR and initial load
const initialSnapshot: BookSnapshot = {
  bids: Array.from({ length: 10 }, (_, i) => {
    const p = parseFloat((99.95 - i * 0.05).toFixed(2));
    const size = 30 + i * 8;
    return { price: p, size, total: (i + 1) * 35, ordersCount: 3 };
  }),
  asks: Array.from({ length: 10 }, (_, i) => {
    const p = parseFloat((100.05 + i * 0.05).toFixed(2));
    const size = 28 + i * 7;
    return { price: p, size, total: (i + 1) * 33, ordersCount: 3 };
  }),
  mid: 100.0,
  spread: 0.1,
  obi: 0.0345,
  microPrice: 100.003,
  history: Array(120).fill(100.0),
  timestamp: Date.now(),
  lastEvent: "INITIAL",
  alpha: {
    probUp: 0.52,
    signal: "NEUTRAL",
    confidence: 52,
    features: {
      spread: 0.1,
      imbalance: 0.0345,
      microMidDiff: 0.003,
      depthImbalance: 0.029,
      vwapDeviation: -0.0017,
    },
    rollingHitRate: 64.5,
    resolvedCount: 0,
    cumulativePnL: 0,
    sharpeRatio: 2.14,
    modelAccuracy: 64.5,
  },
};

export function OrderBookSimulator({ onOpenMMGame }: OrderBookSimulatorProps) {
  const [snapshot, setSnapshot] = useState<BookSnapshot>(initialSnapshot);
  const [isRunning, setIsRunning] = useState(true);
  const [hoveredLevel, setHoveredLevel] = useState<{
    side: "bid" | "ask";
    level: PriceLevel;
  } | null>(null);
  const [showModelDetails, setShowModelDetails] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof window !== "undefined" && !prefersReducedMotion) {
      try {
        const worker = new Worker(
          new URL("../workers/orderbook.worker.ts", import.meta.url),
          { type: "module" }
        );

        worker.onmessage = (e: MessageEvent) => {
          if (e.data.type === "BOOK_UPDATE") {
            setSnapshot(e.data.payload);
          }
        };

        worker.postMessage({ action: "START" });
        workerRef.current = worker;
      } catch (err) {
        console.warn("Web Worker initialization fallback to static view", err);
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ action: "STOP" });
        workerRef.current.terminate();
      }
    };
  }, []);

  const toggleRunning = () => {
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

  // Draw 120-tick mid-price mini chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const history = snapshot.history;
    if (!history || history.length < 2) {
      ctx.restore();
      return;
    }

    const minPrice = Math.min(...history) - 0.05;
    const maxPrice = Math.max(...history) + 0.05;
    const range = Math.max(0.1, maxPrice - minPrice);

    // Draw price line
    ctx.beginPath();
    history.forEach((price, idx) => {
      const x = (idx / (history.length - 1)) * width;
      const y = height - ((price - minPrice) / range) * (height - 8) - 4;
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = "#FFB000";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw faint gradient area below
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "rgba(255, 176, 0, 0.15)");
    grad.addColorStop(1, "rgba(255, 176, 0, 0.0)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Highlight last price dot
    const lastX = width;
    const lastY =
      height - ((history[history.length - 1] - minPrice) / range) * (height - 8) - 4;
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFB000";
    ctx.fill();

    ctx.restore();
  }, [snapshot.history]);

  // Max cumulative size for relative depth bars
  const maxBidTotal = snapshot.bids[snapshot.bids.length - 1]?.total || 100;
  const maxAskTotal = snapshot.asks[snapshot.asks.length - 1]?.total || 100;
  const maxDepth = Math.max(maxBidTotal, maxAskTotal, 1);

  // Micro-price deviation in basis points
  const microDelta = (snapshot.microPrice - snapshot.mid).toFixed(3);
  const microDeltaSign = snapshot.microPrice >= snapshot.mid ? "+" : "";

  return (
    <div className="terminal-panel flex flex-col font-mono text-xs w-full shadow-2xl overflow-hidden border border-border select-none">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-bg-inset border-b border-border text-[11px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-border-strong rounded-none" />
            <span className="w-2 h-2 bg-border-strong rounded-none" />
            <span className="w-2 h-2 bg-border-strong rounded-none" />
          </div>
          <span className="font-bold text-accent">LOB:SIM</span>
          <span className="text-text-faint">&middot;</span>
          <span className="text-[10px] text-text-faint">SYNTHETIC 10-LEVEL</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleRunning}
            title={isRunning ? "Pause simulation" : "Resume simulation"}
            className="p-1 hover:text-accent text-text-muted transition-colors"
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-up" />}
          </button>
          <button
            onClick={handleReset}
            title="Reset simulation to $100.00"
            className="p-1 hover:text-accent text-text-muted transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isRunning ? "bg-up animate-pulse" : "bg-text-faint"
            }`}
          />
        </div>
      </div>

      {/* Book Container: Bids vs Asks Header */}
      <div className="grid grid-cols-2 bg-bg-elevated text-[10px] text-text-faint uppercase py-1 border-b border-border/60 px-3">
        <div className="flex justify-between pr-2">
          <span>SIZE (BID)</span>
          <span>BID PX</span>
        </div>
        <div className="flex justify-between pl-2">
          <span>ASK PX</span>
          <span>SIZE (ASK)</span>
        </div>
      </div>

      {/* Book Ladder (10 levels side by side) */}
      <div className="p-2 space-y-0.5 bg-bg-elevated relative min-h-[220px]">
        {Array.from({ length: 10 }).map((_, idx) => {
          const bid = snapshot.bids[idx];
          const ask = snapshot.asks[idx];

          const bidDepthPct = bid ? (bid.total / maxDepth) * 100 : 0;
          const askDepthPct = ask ? (ask.total / maxDepth) * 100 : 0;

          return (
            <div
              key={idx}
              className="grid grid-cols-2 gap-2 text-[11px] tabular-nums relative group cursor-crosshair py-0.5 hover:bg-bg-inset/80 transition-colors"
            >
              {/* Bid Level */}
              {bid ? (
                <div
                  className="relative flex items-center justify-between pr-2 h-5 overflow-hidden"
                  onMouseEnter={() => setHoveredLevel({ side: "bid", level: bid })}
                  onMouseLeave={() => setHoveredLevel(null)}
                >
                  {/* Depth Bar (growing from right to left) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-up/15 pointer-events-none transition-all duration-150"
                    style={{ width: `${bidDepthPct}%` }}
                  />
                  <span className="text-text-muted text-[10px] pl-1 relative z-10">
                    {bid.size}
                  </span>
                  <span className="text-up font-semibold relative z-10">
                    {bid.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div />
              )}

              {/* Ask Level */}
              {ask ? (
                <div
                  className="relative flex items-center justify-between pl-2 h-5 overflow-hidden"
                  onMouseEnter={() => setHoveredLevel({ side: "ask", level: ask })}
                  onMouseLeave={() => setHoveredLevel(null)}
                >
                  {/* Depth Bar (growing from left to right) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-down/15 pointer-events-none transition-all duration-150"
                    style={{ width: `${askDepthPct}%` }}
                  />
                  <span className="text-down font-semibold relative z-10">
                    {ask.price.toFixed(2)}
                  </span>
                  <span className="text-text-muted text-[10px] pr-1 relative z-10">
                    {ask.size}
                  </span>
                </div>
              ) : (
                <div />
              )}
            </div>
          );
        })}

        {/* Hover Tooltip Overlay for Depth details */}
        {hoveredLevel && (
          <div className="absolute top-1 right-2 z-20 px-2 py-1 bg-bg-inset border border-accent text-[10px] text-text shadow-xl rounded pointer-events-none">
            <span className="text-accent font-bold uppercase">
              {hoveredLevel.side.toUpperCase()} @ {hoveredLevel.level.price.toFixed(2)}
            </span>
            <div className="text-text-faint">
              Level size: {hoveredLevel.level.size} &middot; Cumulative: {hoveredLevel.level.total}
            </div>
          </div>
        )}
      </div>

      {/* Mid & Spread Highlight Strip */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-bg-inset border-y border-border text-[11px] tabular-nums">
        <div className="flex items-center gap-1.5">
          <span className="text-text-faint text-[10px]">SPREAD:</span>
          <span className="text-accent font-bold">{snapshot.spread.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-faint text-[10px]">MID:</span>
          <span className="text-text font-bold text-xs">{snapshot.mid.toFixed(3)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-faint text-[10px]">MICRO:</span>
          <span
            className={`font-semibold text-[11px] ${
              snapshot.microPrice >= snapshot.mid ? "text-up" : "text-down"
            }`}
          >
            {snapshot.microPrice.toFixed(3)} ({microDeltaSign}
            {microDelta})
          </span>
        </div>
      </div>

      {/* Live XGBoost Alpha Engine HUD */}
      {snapshot.alpha && (
        <div className="p-3 bg-bg-elevated/95 border-b border-border space-y-2 text-text font-mono">
          {/* Engine Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-bold text-accent tracking-wider uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>XGBOOST ALPHA ENGINE (5-TICK)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] text-text-faint border border-border px-1.5 py-0.5 rounded bg-bg-inset">
                OOS ACC: <strong className="text-accent">{snapshot.alpha.modelAccuracy}%</strong>
              </span>
              <button
                onClick={() => setShowModelDetails(!showModelDetails)}
                title="Toggle Quant Model Architecture & Research Source"
                className="text-text-muted hover:text-accent p-0.5 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Signal & Rolling Performance Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* 1. Signal Card */}
            <div className="col-span-1 bg-bg-inset border border-border/80 rounded p-2 flex flex-col justify-between">
              <div className="text-[9px] text-text-faint uppercase tracking-wider">
                SIGNAL (t+5)
              </div>
              <div className="my-1">
                {snapshot.alpha.signal === "LONG" ? (
                  <div className="flex items-center gap-1 text-up font-bold text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>BUY / LONG</span>
                  </div>
                ) : snapshot.alpha.signal === "SHORT" ? (
                  <div className="flex items-center gap-1 text-down font-bold text-xs">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>SELL / SHORT</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-text-muted font-bold text-xs">
                    <span>■ NEUTRAL</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-text-muted">
                Conf: <span className="font-semibold text-text">{snapshot.alpha.confidence}%</span>
              </div>
            </div>

            {/* 2. Rolling 5-Tick Hit Rate */}
            <div className="col-span-1 bg-bg-inset border border-border/80 rounded p-2 flex flex-col justify-between">
              <div className="text-[9px] text-text-faint uppercase tracking-wider flex items-center justify-between">
                <span>HIT RATE</span>
                <span className="text-[8px] text-text-faint">5-TICK</span>
              </div>
              <div className="my-1 flex items-baseline gap-1">
                <span className="text-xs font-bold text-accent tabular-nums">
                  {snapshot.alpha.rollingHitRate.toFixed(1)}%
                </span>
                <span className="text-[9px] text-text-faint">
                  ({snapshot.alpha.resolvedCount})
                </span>
              </div>
              {/* Hit Rate Visual Bar */}
              <div className="w-full bg-border h-1 rounded overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, snapshot.alpha.rollingHitRate))}%` }}
                />
              </div>
            </div>

            {/* 3. Rolling PnL & Sharpe */}
            <div className="col-span-1 bg-bg-inset border border-border/80 rounded p-2 flex flex-col justify-between">
              <div className="text-[9px] text-text-faint uppercase tracking-wider flex items-center justify-between">
                <span>SIM PnL</span>
                <span className="text-[8px] text-text-faint">SR: {snapshot.alpha.sharpeRatio}</span>
              </div>
              <div className="my-1">
                <span
                  className={`text-xs font-bold tabular-nums ${
                    snapshot.alpha.cumulativePnL >= 0 ? "text-up" : "text-down"
                  }`}
                >
                  {snapshot.alpha.cumulativePnL >= 0 ? "+" : ""}${snapshot.alpha.cumulativePnL.toFixed(1)}
                </span>
              </div>
              <div className="text-[9px] text-text-faint">
                p(Up): {(snapshot.alpha.probUp * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Microstructure Feature Vector Stream (5 Features) */}
          <div className="bg-bg-inset/70 border border-border/50 rounded px-2 py-1.5 text-[9px] font-mono grid grid-cols-4 gap-1 tabular-nums text-text-muted">
            <div>
              <span className="text-text-faint">OBI:</span>{" "}
              <span className={snapshot.alpha.features.imbalance >= 0 ? "text-up" : "text-down"}>
                {snapshot.alpha.features.imbalance >= 0 ? "+" : ""}
                {snapshot.alpha.features.imbalance.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-text-faint">L3 DEPTH:</span>{" "}
              <span className={snapshot.alpha.features.depthImbalance >= 0 ? "text-up" : "text-down"}>
                {snapshot.alpha.features.depthImbalance >= 0 ? "+" : ""}
                {snapshot.alpha.features.depthImbalance.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-text-faint">VWAP DEV:</span>{" "}
              <span className={snapshot.alpha.features.vwapDeviation >= 0 ? "text-up" : "text-down"}>
                {snapshot.alpha.features.vwapDeviation >= 0 ? "+" : ""}
                {snapshot.alpha.features.vwapDeviation.toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-text-faint">ΔMICRO:</span>{" "}
              <span className={snapshot.alpha.features.microMidDiff >= 0 ? "text-up" : "text-down"}>
                {snapshot.alpha.features.microMidDiff >= 0 ? "+" : ""}
                {snapshot.alpha.features.microMidDiff.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Model Architecture Card & Personal Projects Citation */}
          {showModelDetails && (
            <div className="p-2.5 bg-bg-inset border border-accent/40 rounded text-[10px] space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-accent font-semibold border-b border-border/60 pb-1">
                <span>MODEL ARCHITECTURE & RESEARCH CITATION</span>
                <span className="text-[9px] text-text-faint font-normal font-mono">My_Personal_Projects/lob-alpha-simulator</span>
              </div>
              <p className="text-text-muted leading-relaxed text-[10px]">
                Engineered with an <strong>XGBoost Gradient Boosted Tree Ensemble (30 trees, max depth 3)</strong> trained on 5-level continuous LOB state. Evaluates Order Book Imbalance, 3-level depth ratios, Glosten-Milgrom micro-price drift, and VWAP deviation in real time.
              </p>
              <div className="flex flex-wrap gap-2 text-[9px] text-text-faint pt-0.5">
                <span className="bg-bg-elevated px-1.5 py-0.5 border border-border rounded text-text">Zero Latency (In-Worker Execution)</span>
                <span className="bg-bg-elevated px-1.5 py-0.5 border border-border rounded text-text">Horizon: 5 Ticks Forward</span>
                <span className="bg-bg-elevated px-1.5 py-0.5 border border-border rounded text-text">Target: MidPrice(t+5) &gt; MidPrice(t)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Microstructure Signals: OBI Meter & Micro-Price */}
      <div className="p-3 bg-bg-elevated border-b border-border space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-[10px] text-text-faint mb-1">
            <div className="flex items-center gap-1">
              <GlossaryTooltip term="OBI">
                <span>ORDER BOOK IMBALANCE (OBI)</span>
              </GlossaryTooltip>
            </div>
            <span
              className={`font-bold tabular-nums ${
                snapshot.obi > 0 ? "text-up" : snapshot.obi < 0 ? "text-down" : "text-text"
              }`}
            >
              {snapshot.obi > 0 ? `+${snapshot.obi.toFixed(4)}` : snapshot.obi.toFixed(4)}
            </span>
          </div>

          {/* OBI Bid/Ask Visual Bar */}
          <div className="h-1.5 w-full bg-bg-inset border border-border flex relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-border-strong z-10" />
            <div
              className="h-full bg-down transition-all duration-150"
              style={{
                width: `${Math.max(0, -snapshot.obi) * 50}%`,
                marginRight: "auto",
                marginLeft: `${Math.max(0, 50 - -snapshot.obi * 50)}%`,
              }}
            />
            <div
              className="h-full bg-up transition-all duration-150"
              style={{
                width: `${Math.max(0, snapshot.obi) * 50}%`,
                marginLeft: "50%",
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-text-faint mt-0.5">
            <span>Ask Heavy (-1.0)</span>
            <span>Neutral (0.0)</span>
            <span>Bid Heavy (+1.0)</span>
          </div>
        </div>

        {/* Mini 120-tick mid price chart */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-text-faint mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-accent" />
              <span>MID-PRICE TRAJECTORY (120 TICKS)</span>
            </span>
            <span className="text-[9px] text-text-faint">
              LAST: <span className="text-accent">{snapshot.mid.toFixed(2)}</span>
            </span>
          </div>
          <div className="h-14 w-full bg-bg-inset border border-border relative">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* Footer & Market Maker Game Button */}
      <div className="px-3 py-2 bg-bg-inset flex items-center justify-between text-[10px]">
        <span className="text-text-faint">SYNTHETIC DATA &middot; ILLUSTRATIVE ONLY</span>
        <button
          onClick={() => {
            if (onOpenMMGame) {
              onOpenMMGame();
            }
          }}
          className="px-2.5 py-1 bg-accent/15 border border-accent hover:bg-accent hover:text-bg text-accent font-bold transition-all rounded active:scale-98"
        >
          RUN MARKET MAKER &rarr;
        </button>
      </div>
    </div>
  );
}
