"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RefreshCw, Sparkles, TrendingUp } from "lucide-react";

interface ArmState {
  trueRate: number; // e.g. 0.08
  alpha: number; // successes + 1
  beta: number; // failures + 1
  pulls: number;
  successes: number;
}

export function ThompsonSimulator() {
  const [rateA, setRateA] = useState(0.08); // 8% conversion
  const [rateB, setRateB] = useState(0.14); // 14% conversion (better arm)
  const [rounds, setRounds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [armA, setArmA] = useState<ArmState>({
    trueRate: 0.08,
    alpha: 1,
    beta: 1,
    pulls: 0,
    successes: 0,
  });

  const [armB, setArmB] = useState<ArmState>({
    trueRate: 0.14,
    alpha: 1,
    beta: 1,
    pulls: 0,
    successes: 0,
  });

  const [regretHistory, setRegretHistory] = useState<
    { round: number; thompsonRegret: number; staticRegret: number }[]
  >([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gamma distribution sampling for Beta(alpha, beta)
  function sampleGamma(a: number): number {
    if (a < 1) {
      return sampleGamma(a + 1) * Math.pow(Math.random(), 1 / a);
    }
    const d = a - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
      let z = 0;
      let v = 0;
      do {
        // Box-Muller
        const u1 = Math.random();
        const u2 = Math.random();
        z = Math.sqrt(-2.0 * Math.log(Math.max(1e-12, u1))) * Math.cos(2.0 * Math.PI * u2);
        v = 1 + c * z;
      } while (v <= 0);
      v = v * v * v;
      const u = Math.random();
      if (u < 1 - 0.0331 * z * z * z * z) return d * v;
      if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
    }
  }

  function sampleBeta(alpha: number, beta: number): number {
    const x = sampleGamma(alpha);
    const y = sampleGamma(beta);
    return x / (x + y);
  }

  const stepSimulation = (batchSize: number = 5) => {
    let currentA = { ...armA, trueRate: rateA };
    let currentB = { ...armB, trueRate: rateB };
    let currentRegretHistory = [...regretHistory];

    const optimalRate = Math.max(rateA, rateB);

    let lastTRegret =
      currentRegretHistory.length > 0
        ? currentRegretHistory[currentRegretHistory.length - 1].thompsonRegret
        : 0;
    let lastSRegret =
      currentRegretHistory.length > 0
        ? currentRegretHistory[currentRegretHistory.length - 1].staticRegret
        : 0;

    for (let i = 0; i < batchSize; i++) {
      // 1. Thompson Sampling: sample theta from posterior Beta(alpha, beta) for each arm
      const thetaA = sampleBeta(currentA.alpha, currentA.beta);
      const thetaB = sampleBeta(currentB.alpha, currentB.beta);

      // 2. Select arm with highest sampled probability
      const chosenArm = thetaA >= thetaB ? "A" : "B";

      if (chosenArm === "A") {
        const success = Math.random() < currentA.trueRate ? 1 : 0;
        currentA.pulls += 1;
        currentA.successes += success;
        currentA.alpha += success;
        currentA.beta += 1 - success;
        lastTRegret += optimalRate - currentA.trueRate;
      } else {
        const success = Math.random() < currentB.trueRate ? 1 : 0;
        currentB.pulls += 1;
        currentB.successes += success;
        currentB.alpha += success;
        currentB.beta += 1 - success;
        lastTRegret += optimalRate - currentB.trueRate;
      }

      // 3. Static 50/50 A/B Test benchmark regret
      const staticExpectedReward = 0.5 * rateA + 0.5 * rateB;
      lastSRegret += optimalRate - staticExpectedReward;
    }

    const newRounds = rounds + batchSize;
    currentRegretHistory.push({
      round: newRounds,
      thompsonRegret: parseFloat(lastTRegret.toFixed(2)),
      staticRegret: parseFloat(lastSRegret.toFixed(2)),
    });

    if (currentRegretHistory.length > 100) {
      currentRegretHistory.shift();
    }

    setArmA(currentA);
    setArmB(currentB);
    setRounds(newRounds);
    setRegretHistory(currentRegretHistory);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        stepSimulation(10);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, armA, armB, rounds, rateA, rateB, regretHistory]);

  const handleReset = () => {
    setIsRunning(false);
    setRounds(0);
    setArmA({ trueRate: rateA, alpha: 1, beta: 1, pulls: 0, successes: 0 });
    setArmB({ trueRate: rateB, alpha: 1, beta: 1, pulls: 0, successes: 0 });
    setRegretHistory([]);
  };

  // Draw Cumulative Regret Curve on Canvas
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

    if (regretHistory.length < 2) {
      ctx.fillStyle = "rgba(139, 150, 165, 0.4)";
      ctx.font = "10px monospace";
      ctx.fillText("Click RUN to simulate Bayesian Thompson Sampling vs Static 50/50 A/B Test", 10, height / 2);
      ctx.restore();
      return;
    }

    const maxRegret = Math.max(
      ...regretHistory.map((r) => r.staticRegret),
      ...regretHistory.map((r) => r.thompsonRegret),
      1
    );

    // Static 50/50 A/B Test (Linear Regret - Red)
    ctx.beginPath();
    regretHistory.forEach((pt, idx) => {
      const x = (idx / (regretHistory.length - 1)) * width;
      const y = height - (pt.staticRegret / maxRegret) * (height - 24) - 8;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#FF4D5E";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Thompson Sampling (Sublinear Logarithmic Regret - Green)
    ctx.beginPath();
    regretHistory.forEach((pt, idx) => {
      const x = (idx / (regretHistory.length - 1)) * width;
      const y = height - (pt.thompsonRegret / maxRegret) * (height - 24) - 8;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#00D68F";
    ctx.lineWidth = 2.0;
    ctx.stroke();

    ctx.restore();
  }, [regretHistory]);

  return (
    <div className="terminal-panel p-6 bg-bg-elevated border border-border font-mono text-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-sm text-text">
            THOMPSON SAMPLING BANDIT | CONVERSION OPTIMIZATION
          </span>
          <span className="px-1.5 py-0.5 bg-bg-inset border border-border text-[10px] text-accent">
            BAYESIAN MAB
          </span>
        </div>
        <div className="text-[10px] text-text-faint">
          PRJ-004 QUANT CASE STUDY SIMULATOR
        </div>
      </div>

      <div className="text-[11px] text-text-muted leading-relaxed">
        Demonstrates why replacing static heuristic scoring (e.g. HimaVogue&apos;s arbitrary <code>vScore = 3*sales + 2*carts + views</code>) with <strong>Bayesian Multi-Armed Bandits</strong> minimizes regret by dynamically directing traffic toward higher-converting product offerings.
      </div>

      {/* Sliders & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg-inset p-4 border border-border rounded">
        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-text font-bold">ARM A (BASELINE VARIANT):</span>
            <span className="text-text font-semibold">{(rateA * 100).toFixed(0)}% TRUE CVR</span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.30"
            step="0.01"
            value={rateA}
            onChange={(e) => setRateA(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <div className="text-[10px] text-text-faint mt-1">
            Pulls: {armA.pulls} &middot; Successes: {armA.successes} &middot; Posterior: Beta({armA.alpha}, {armA.beta})
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-accent font-bold">ARM B (OPTIMIZED VARIANT):</span>
            <span className="text-accent font-semibold">{(rateB * 100).toFixed(0)}% TRUE CVR</span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.30"
            step="0.01"
            value={rateB}
            onChange={(e) => setRateB(parseFloat(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <div className="text-[10px] text-text-faint mt-1">
            Pulls: {armB.pulls} &middot; Successes: {armB.successes} &middot; Posterior: Beta({armB.alpha}, {armB.beta})
          </div>
        </div>
      </div>

      {/* Live Regret Chart & Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Allocation Ratio Bars (5 cols) */}
        <div className="lg:col-span-5 space-y-3 bg-bg-inset p-4 border border-border rounded">
          <div className="text-[11px] font-bold text-accent uppercase border-b border-border pb-1">
            Adaptive Traffic Allocation ({rounds} Impressions)
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Arm A Traffic Share:</span>
              <span className="font-bold text-text tabular-nums">
                {rounds > 0 ? ((armA.pulls / rounds) * 100).toFixed(1) : "50.0"}%
              </span>
            </div>
            <div className="h-2 w-full bg-bg-elevated border border-border rounded overflow-hidden">
              <div
                className="h-full bg-text-muted transition-all duration-150"
                style={{ width: `${rounds > 0 ? (armA.pulls / rounds) * 100 : 50}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-accent">Arm B Traffic Share:</span>
              <span className="font-bold text-accent tabular-nums">
                {rounds > 0 ? ((armB.pulls / rounds) * 100).toFixed(1) : "50.0"}%
              </span>
            </div>
            <div className="h-2 w-full bg-bg-elevated border border-border rounded overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: `${rounds > 0 ? (armB.pulls / rounds) * 100 : 50}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1.5 bg-accent text-bg font-bold rounded flex items-center gap-1.5 hover:brightness-110 active:scale-98"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? "PAUSE" : "SIMULATE"}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-bg-elevated border border-border text-text-muted hover:text-text rounded flex items-center gap-1.5 active:scale-98"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Right: Cumulative Regret Comparison Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-text-faint px-1">
            <span>CUMULATIVE REGRET COMPARISON</span>
            <div className="flex items-center gap-3">
              <span className="text-up font-semibold">&mdash; Thompson Sampling (Sublinear)</span>
              <span className="text-down font-semibold">&mdash; Static 50/50 (Linear Regret)</span>
            </div>
          </div>

          <div className="h-44 w-full bg-bg-inset border border-border rounded relative">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          <div className="text-[10px] text-text-faint">
            *Cumulative regret measures the expected revenue or conversion lost compared to always picking the omniscient best arm. Thompson Sampling quickly exploits the superior arm while static A/B testing bleeds linear regret.
          </div>
        </div>
      </div>
    </div>
  );
}
