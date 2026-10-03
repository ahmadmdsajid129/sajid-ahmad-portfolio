"use client";

import React, { useState, useEffect, useRef } from "react";
import { MonteCarloConfig, MonteCarloResult } from "@/workers/montecarlo.worker";
import { GlossaryTooltip } from "./glossary-tooltip";
import { Play, RefreshCw, BarChart2, ShieldCheck, Zap, Info } from "lucide-react";

const initialResult: MonteCarloResult = {
  europeanBS: 10.4506,
  europeanMC: {
    name: "European Call (Monte Carlo)",
    price: 10.4574,
    standardError: 0.0482,
    ciLower: 10.3629,
    ciUpper: 10.5519,
  },
  asianCall: {
    name: "Asian Call (Optimized CV)",
    price: 5.7404,
    standardError: 0.0195,
    ciLower: 5.7022,
    ciUpper: 5.7786,
    varianceReductionRatio: 3.42,
  },
  barrierCall: {
    name: "Barrier Call (Down & Out)",
    price: 10.0429,
    standardError: 0.0468,
    ciLower: 9.9512,
    ciUpper: 10.1346,
  },
  bsVsMcError: 0.0068,
  delta: 0.5896,
  vega: 0.2156,
  samplePaths: [],
  histogram: [],
  convergence: [],
  executionTimeMs: 142.5,
  seed: 42,
};

export function MonteCarloLab() {
  const [config, setConfig] = useState<MonteCarloConfig>({
    S0: 100,
    K: 100,
    r: 0.05,
    sigma: 0.2,
    T: 1.0,
    paths: 25000,
    steps: 50,
    barrierLevel: 80,
    useAntithetic: true,
    useControlVariate: true,
    seed: 42,
  });

  const [result, setResult] = useState<MonteCarloResult>(initialResult);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"paths" | "convergence" | "histogram">("paths");

  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    try {
      const worker = new Worker(
        new URL("../workers/montecarlo.worker.ts", import.meta.url),
        { type: "module" }
      );

      worker.onmessage = (e: MessageEvent) => {
        if (e.data.type === "RESULT") {
          setResult(e.data.payload);
          setIsRunning(false);
        }
      };

      workerRef.current = worker;
      // Run initial run
      worker.postMessage({ action: "RUN", config });
      setIsRunning(true);
    } catch (err) {
      console.warn("Monte Carlo worker fallback", err);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const handleRun = () => {
    if (!workerRef.current) return;
    setIsRunning(true);
    workerRef.current.postMessage({ action: "RUN", config });
  };

  const handleReseed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    const updated = { ...config, seed: newSeed };
    setConfig(updated);
    if (workerRef.current) {
      setIsRunning(true);
      workerRef.current.postMessage({ action: "RUN", config: updated });
    }
  };

  // Render Canvas Chart (Paths or Convergence)
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

    if (activeTab === "paths" && result.samplePaths.length > 0) {
      // Find min and max across sample paths
      let minVal = 100;
      let maxVal = 100;
      for (const p of result.samplePaths) {
        for (const val of p) {
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        }
      }
      minVal = Math.min(minVal, config.barrierLevel - 5);
      const range = Math.max(10, maxVal - minVal);

      // Draw Barrier Line (H)
      const barrierY = height - ((config.barrierLevel - minVal) / range) * (height - 16) - 8;
      ctx.beginPath();
      ctx.strokeStyle = "#FF4D5E";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, barrierY);
      ctx.lineTo(width, barrierY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#FF4D5E";
      ctx.font = "9px monospace";
      ctx.fillText(`BARRIER H=${config.barrierLevel}`, 6, barrierY - 3);

      // Draw Strike Line (K)
      const strikeY = height - ((config.K - minVal) / range) * (height - 16) - 8;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 176, 0, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.moveTo(0, strikeY);
      ctx.lineTo(width, strikeY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255, 176, 0, 0.8)";
      ctx.font = "9px monospace";
      ctx.fillText(`STRIKE K=${config.K}`, width - 75, strikeY - 3);

      // Draw Paths
      result.samplePaths.forEach((path, pIdx) => {
        ctx.beginPath();
        path.forEach((val, stepIdx) => {
          const x = (stepIdx / (path.length - 1)) * width;
          const y = height - ((val - minVal) / range) * (height - 16) - 8;
          if (stepIdx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        // Highlight breached paths vs in-the-money paths
        const breached = Math.min(...path) <= config.barrierLevel;
        if (breached) {
          ctx.strokeStyle = "rgba(86, 96, 112, 0.25)";
          ctx.lineWidth = 0.8;
        } else if (pIdx % 3 === 0) {
          ctx.strokeStyle = "rgba(255, 176, 0, 0.4)";
          ctx.lineWidth = 1.0;
        } else {
          ctx.strokeStyle = "rgba(0, 214, 143, 0.35)";
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      });
    } else if (activeTab === "convergence" && result.convergence.length > 0) {
      // Draw Convergence Curve with CI Band
      const conv = result.convergence;
      const prices = conv.map((c) => c.price);
      const minP = Math.min(...conv.map((c) => c.ciLower), result.europeanBS) - 0.2;
      const maxP = Math.max(...conv.map((c) => c.ciUpper), result.europeanBS) + 0.2;
      const pRange = Math.max(0.5, maxP - minP);

      // True Black Scholes Benchmark Line
      const bsY = height - ((result.europeanBS - minP) / pRange) * (height - 20) - 10;
      ctx.beginPath();
      ctx.strokeStyle = "#00D68F";
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, bsY);
      ctx.lineTo(width, bsY);
      ctx.stroke();

      ctx.fillStyle = "#00D68F";
      ctx.font = "9px monospace";
      ctx.fillText(`BLACK-SCHOLES: ${result.europeanBS.toFixed(4)}`, 10, bsY - 4);

      // 95% Confidence Interval Upper/Lower Area
      ctx.beginPath();
      conv.forEach((c, idx) => {
        const x = (idx / (conv.length - 1)) * width;
        const y = height - ((c.ciUpper - minP) / pRange) * (height - 20) - 10;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      for (let idx = conv.length - 1; idx >= 0; idx--) {
        const c = conv[idx];
        const x = (idx / (conv.length - 1)) * width;
        const y = height - ((c.ciLower - minP) / pRange) * (height - 20) - 10;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 176, 0, 0.15)";
      ctx.fill();

      // Estimate line
      ctx.beginPath();
      conv.forEach((c, idx) => {
        const x = (idx / (conv.length - 1)) * width;
        const y = height - ((c.price - minP) / pRange) * (height - 20) - 10;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#FFB000";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    } else if (activeTab === "histogram" && result.histogram.length > 0) {
      // Draw Payoff Histogram
      const maxCount = Math.max(...result.histogram.map((h) => h.count), 1);
      const barWidth = width / result.histogram.length;

      result.histogram.forEach((h, idx) => {
        const barHeight = (h.count / maxCount) * (height - 24);
        const x = idx * barWidth;
        const y = height - barHeight - 4;

        ctx.fillStyle = idx === 0 ? "rgba(255, 77, 94, 0.4)" : "rgba(255, 176, 0, 0.5)";
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

        ctx.strokeStyle = idx === 0 ? "#FF4D5E" : "#FFB000";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 1, y, barWidth - 2, barHeight);
      });
    }

    ctx.restore();
  }, [result, activeTab, config]);

  return (
    <div className="terminal-panel p-6 bg-bg-elevated border border-border shadow-2xl font-mono text-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-sm text-text">
            IN-BROWSER MONTE CARLO PRICING KERNEL
          </span>
          <span className="px-1.5 py-0.5 bg-bg-inset border border-border text-[10px] text-accent">
            WEB WORKER
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-text-faint">
          <span>SEED: {config.seed}</span>
          <button
            onClick={handleReseed}
            className="hover:text-accent flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>RESEED</span>
          </button>
        </div>
      </div>

      <div className="text-[11px] text-text-muted leading-relaxed">
        Vectorized Geometric Brownian Motion (GBM) pricing engine executing path simulations directly in a Web Worker. Demonstrates <strong>Antithetic Variates</strong> and closed-form <strong>Control Variates</strong> to suppress simulation standard error.
      </div>

      {/* Main Grid: Controls Left, Live Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Sliders & Toggles (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5 bg-bg-inset p-4 border border-border rounded">
          <div className="text-[11px] font-bold text-accent uppercase border-b border-border pb-1">
            Contract &amp; Simulation Parameters
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-faint block">SPOT (S0): ${config.S0}</label>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={config.S0}
                onChange={(e) => setConfig({ ...config, S0: parseFloat(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-faint block">STRIKE (K): ${config.K}</label>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={config.K}
                onChange={(e) => setConfig({ ...config, K: parseFloat(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-faint block">
                VOLATILITY (&sigma;): {(config.sigma * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={config.sigma}
                onChange={(e) => setConfig({ ...config, sigma: parseFloat(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-faint block">
                RISK-FREE (r): {(config.r * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.01"
                max="0.15"
                step="0.01"
                value={config.r}
                onChange={(e) => setConfig({ ...config, r: parseFloat(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-faint block">
                PATHS: {config.paths.toLocaleString()}
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={config.paths}
                onChange={(e) => setConfig({ ...config, paths: parseInt(e.target.value, 10) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-faint block">
                BARRIER (H): ${config.barrierLevel}
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={config.barrierLevel}
                onChange={(e) => setConfig({ ...config, barrierLevel: parseFloat(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
            </div>
          </div>

          {/* Variance Reduction Toggles */}
          <div className="pt-2 border-t border-border space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.useAntithetic}
                onChange={(e) => setConfig({ ...config, useAntithetic: e.target.checked })}
                className="accent-accent"
              />
              <span className="text-[11px] text-text">
                <GlossaryTooltip term="Antithetic variates">Antithetic Variates (Z &harr; -Z)</GlossaryTooltip>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.useControlVariate}
                onChange={(e) => setConfig({ ...config, useControlVariate: e.target.checked })}
                className="accent-accent"
              />
              <span className="text-[11px] text-text">
                <GlossaryTooltip term="Control variates">Control Variate (Analytical European Anchor)</GlossaryTooltip>
              </span>
            </label>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full h-10 mt-2 bg-accent text-bg font-bold rounded flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? "COMPUTING PATHS..." : "RE-PRICE CONTRACTS"}</span>
          </button>
        </div>

        {/* Right: Results Blotter & Visual Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real-time Pricing Comparison Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 tabular-nums">
            {/* European Option Box */}
            <div className="p-3 bg-bg-inset border border-border rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-text-faint uppercase block">
                  European Call
                </span>
                <div className="text-lg font-bold text-accent mt-0.5">
                  ${result.europeanMC.price.toFixed(4)}
                </div>
              </div>
              <div className="text-[10px] text-text-muted mt-2 pt-1 border-t border-border/40 space-y-0.5">
                <div>BS: ${result.europeanBS.toFixed(4)}</div>
                <div className="text-up font-semibold">
                  Diff: {result.bsVsMcError.toFixed(4)} (
                  {((result.bsVsMcError / result.europeanBS) * 100).toFixed(2)}%)
                </div>
                <div className="text-text-faint">SE: &plusmn;{result.europeanMC.standardError.toFixed(4)}</div>
              </div>
            </div>

            {/* Asian Arithmetic Call Box */}
            <div className="p-3 bg-bg-inset border border-border rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-text-faint uppercase block">
                  Asian Arithmetic Call
                </span>
                <div className="text-lg font-bold text-text mt-0.5">
                  ${result.asianCall.price.toFixed(4)}
                </div>
              </div>
              <div className="text-[10px] text-text-muted mt-2 pt-1 border-t border-border/40 space-y-0.5">
                <div>95% CI: [{result.asianCall.ciLower.toFixed(3)}, {result.asianCall.ciUpper.toFixed(3)}]</div>
                <div className="text-accent font-semibold">
                  VR Ratio: {result.asianCall.varianceReductionRatio}x
                </div>
                <div className="text-text-faint">SE: &plusmn;{result.asianCall.standardError.toFixed(4)}</div>
              </div>
            </div>

            {/* Barrier Down & Out Box */}
            <div className="p-3 bg-bg-inset border border-border rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-text-faint uppercase block">
                  Barrier Call (D&amp;O)
                </span>
                <div className="text-lg font-bold text-text mt-0.5">
                  ${result.barrierCall.price.toFixed(4)}
                </div>
              </div>
              <div className="text-[10px] text-text-muted mt-2 pt-1 border-t border-border/40 space-y-0.5">
                <div>Barrier: ${config.barrierLevel}</div>
                <div>95% CI: [{result.barrierCall.ciLower.toFixed(3)}, {result.barrierCall.ciUpper.toFixed(3)}]</div>
                <div className="text-text-faint">SE: &plusmn;{result.barrierCall.standardError.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* Greeks Strip via CRN */}
          <div className="p-2.5 bg-bg-inset border border-border rounded flex items-center justify-between text-xs tabular-nums">
            <div className="flex items-center gap-1">
              <GlossaryTooltip term="Delta">
                <span className="text-text-faint">ASIAN DELTA (&part;V/&part;S):</span>
              </GlossaryTooltip>
              <span className="text-accent font-bold">{result.delta.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-1">
              <GlossaryTooltip term="Vega">
                <span className="text-text-faint">ASIAN VEGA (&part;V/&part;&sigma;):</span>
              </GlossaryTooltip>
              <span className="text-up font-bold">{result.vega.toFixed(4)}</span>
            </div>
            <div className="text-[10px] text-text-faint hidden sm:inline">
              CENTRAL DIFFERENCE + CRN SEEDING
            </div>
          </div>

          {/* Interactive Chart Canvas with View Switcher */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-text-faint px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("paths")}
                  className={`px-2 py-0.5 rounded ${
                    activeTab === "paths" ? "bg-accent text-bg font-bold" : "hover:text-text"
                  }`}
                >
                  SAMPLE PATHS (GBM FAN)
                </button>
                <button
                  onClick={() => setActiveTab("convergence")}
                  className={`px-2 py-0.5 rounded ${
                    activeTab === "convergence" ? "bg-accent text-bg font-bold" : "hover:text-text"
                  }`}
                >
                  CONVERGENCE &amp; CI
                </button>
                <button
                  onClick={() => setActiveTab("histogram")}
                  className={`px-2 py-0.5 rounded ${
                    activeTab === "histogram" ? "bg-accent text-bg font-bold" : "hover:text-text"
                  }`}
                >
                  PAYOFF HISTOGRAM
                </button>
              </div>
              <span className="text-[10px] text-text-faint">
                {result.executionTimeMs}ms
              </span>
            </div>

            <div className="h-44 w-full bg-bg-inset border border-border rounded relative">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-text-faint gap-1">
        <span>
          Client-side re-implementation for demonstration. Production engine: Python/NumPy API in the linked repo.
        </span>
        <span className="text-accent font-semibold">
          Antithetic + Control Variates active
        </span>
      </div>
    </div>
  );
}
