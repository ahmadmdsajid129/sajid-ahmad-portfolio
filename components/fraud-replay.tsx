"use client";

import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

interface SHAPDriver {
  feature: string;
  impact: number; // positive increases fraud risk, negative reduces
  value: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  amount: string;
  decision: "APPROVE" | "REVIEW" | "BLOCK";
  compositeScore: number; // 0 - 100
  mlScore: number;
  anomalyScore: number;
  behaviorScore: number;
  rulesScore: number;
  triggeredRules: string[];
  shapDrivers: SHAPDriver[];
}

const scenarios: Scenario[] = [
  {
    id: "normal",
    name: "Normal spend ($4.50)",
    description: "Recurring morning coffee at local merchant. Trusted device, consistent geo.",
    amount: "$4.50",
    decision: "APPROVE",
    compositeScore: 12,
    mlScore: 0.04,
    anomalyScore: 0.08,
    behaviorScore: 0.15,
    rulesScore: 0.0,
    triggeredRules: [],
    shapDrivers: [
      { feature: "Historical merchant consistency", impact: -0.42, value: "High match (0.94)" },
      { feature: "Device fingerprint age", impact: -0.31, value: "182 days trusted" },
      { feature: "Transaction amount vs mean", impact: -0.18, value: "Z-Score: -0.45" },
      { feature: "Velocity 1h window", impact: 0.05, value: "1 txn" },
    ],
  },
  {
    id: "velocity",
    name: "Velocity burst (5x)",
    description: "5 rapid transactions within 90 seconds across multiple online checkouts.",
    amount: "$185.00",
    decision: "REVIEW",
    compositeScore: 68,
    mlScore: 0.62,
    anomalyScore: 0.74,
    behaviorScore: 0.88,
    rulesScore: 40.0,
    triggeredRules: ["R03: Velocity burst (>3 txns / 2 min)", "R05: Unusual merchant category"],
    shapDrivers: [
      { feature: "Txn velocity 5m sliding window", impact: +0.65, value: "5 txns (Z: +4.8)" },
      { feature: "Time delta since last transaction", impact: +0.48, value: "14 seconds" },
      { feature: "Isolation Forest anomaly score", impact: +0.35, value: "0.74 (Elevated)" },
      { feature: "Device fingerprint match", impact: -0.22, value: "Known device" },
    ],
  },
  {
    id: "travel",
    name: "Impossible travel",
    description: "Card swipe in Tokyo 15 minutes after physical POS transaction in New York City.",
    amount: "$620.00",
    decision: "BLOCK",
    compositeScore: 94,
    mlScore: 0.89,
    anomalyScore: 0.96,
    behaviorScore: 0.98,
    rulesScore: 100.0,
    triggeredRules: [
      "R01: Impossible geo-velocity (>850 km/h)",
      "R04: Cross-border foreign terminal",
    ],
    shapDrivers: [
      { feature: "Haversine calculated travel speed", impact: +0.92, value: "26,800 km/h" },
      { feature: "Country divergence from home", impact: +0.62, value: "US &rarr; JP (15 min)" },
      { feature: "IP country vs Card issuing country", impact: +0.45, value: "Mismatch" },
      { feature: "Account historical tenure", impact: -0.12, value: "3 years" },
    ],
  },
  {
    id: "takeover",
    name: "Account takeover ($9,450)",
    description: "High-value wire at 02:40 AM from previously unseen device with password change 10m prior.",
    amount: "$9,450.00",
    decision: "BLOCK",
    compositeScore: 98,
    mlScore: 0.96,
    anomalyScore: 0.98,
    behaviorScore: 0.95,
    rulesScore: 100.0,
    triggeredRules: [
      "R02: High-value checkout on unverified device",
      "R06: Recent credential update (<1h)",
      "R07: Midnight high-risk window",
    ],
    shapDrivers: [
      { feature: "Transaction amount vs user 90d max", impact: +0.88, value: "$9,450 (Z: +8.2)" },
      { feature: "Device graph linkage", impact: +0.76, value: "Unseen hardware hash" },
      { feature: "Recent security credential change", impact: +0.64, value: "11 minutes ago" },
      { feature: "Time of day deviation", impact: +0.32, value: "02:40:15 local" },
    ],
  },
];

export function FraudReplay() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);

  return (
    <div className="terminal-panel p-6 bg-bg-elevated border border-border font-mono text-xs space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-sm text-text">
            FORENSIC FRAUD PIPELINE REPLAY
          </span>
          <span className="px-1.5 py-0.5 bg-bg-inset border border-border text-[10px] text-accent">
            INTERACTIVE SCENARIO SUITE
          </span>
        </div>
        <div className="text-[10px] text-text-faint">
          SAMPLE SCENARIOS &middot; REPRODUCIBLE MODEL OUTPUTS
        </div>
      </div>

      {/* Scenario Selector Buttons */}
      <div className="space-y-1.5">
        <div className="text-[11px] text-text-faint uppercase">
          Select Simulated Attack Scenario:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {scenarios.map((sc) => {
            const isSelected = sc.id === selectedScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`p-3 text-left border rounded transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-accent/15 border-accent text-text"
                    : "bg-bg-inset border-border text-text-muted hover:border-border-strong hover:text-text"
                }`}
              >
                <div>
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{sc.name}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 font-semibold ${
                        sc.decision === "APPROVE"
                          ? "text-up"
                          : sc.decision === "REVIEW"
                          ? "text-warn"
                          : "text-down"
                      }`}
                    >
                      {sc.decision}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-faint mt-1 line-clamp-2">
                    {sc.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forensic Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-bg-inset p-4 border border-border rounded">
        {/* Left: Decision & Risk Gauge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <div className="text-[10px] text-text-faint uppercase mb-1">Risk Arbitration</div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 font-bold text-sm border rounded ${
                  selectedScenario.decision === "APPROVE"
                    ? "bg-up/20 border-up text-up"
                    : selectedScenario.decision === "REVIEW"
                    ? "bg-warn/20 border-warn text-warn"
                    : "bg-down/20 border-down text-down"
                }`}
              >
                {selectedScenario.decision}
              </span>
              <span className="text-xl font-bold tabular-nums text-text">
                SCORE: {selectedScenario.compositeScore} / 100
              </span>
            </div>
          </div>

          {/* Composite Gauge Meter with Bands */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-bg-elevated border border-border relative overflow-hidden rounded-sm">
              {/* Bands: APPROVE <30 (green), REVIEW 30-75 (amber), BLOCK >=75 (red) */}
              <div className="absolute top-0 bottom-0 left-0 w-[30%] bg-up/20 border-r border-border" />
              <div className="absolute top-0 bottom-0 left-[30%] w-[45%] bg-warn/20 border-r border-border" />
              <div className="absolute top-0 bottom-0 left-[75%] w-[25%] bg-down/20" />
              {/* Score Indicator Needle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-text shadow-lg transition-all duration-300 z-10"
                style={{ left: `${selectedScenario.compositeScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-text-faint">
              <span className="text-up">APPROVE (&lt;30)</span>
              <span className="text-warn">REVIEW (30-75)</span>
              <span className="text-down">BLOCK (&ge;75)</span>
            </div>
          </div>

          {/* Sub-Score Breakdown (55% ML, 15% Anomaly, 15% Behavior, 15% Rules) */}
          <div className="space-y-1.5 pt-2 border-t border-border/60 text-[11px] tabular-nums">
            <div className="flex justify-between text-text-muted">
              <span>XGBoost Probability (55%):</span>
              <span className="text-text font-semibold">
                {(selectedScenario.mlScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Isolation Forest Anomaly (15%):</span>
              <span className="text-text font-semibold">
                {selectedScenario.anomalyScore.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Redis Behavioral Velocity (15%):</span>
              <span className="text-text font-semibold">
                {(selectedScenario.behaviorScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Deterministic Rules Engine (15%):</span>
              <span className="text-text font-semibold">
                {selectedScenario.rulesScore.toFixed(0)} pts
              </span>
            </div>
          </div>

          {/* Triggered Rules */}
          <div>
            <div className="text-[10px] text-text-faint uppercase mb-1">
              Triggered Rule Violations:
            </div>
            {selectedScenario.triggeredRules.length === 0 ? (
              <div className="text-up text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero deterministic rule violations triggered.</span>
              </div>
            ) : (
              <div className="space-y-1">
                {selectedScenario.triggeredRules.map((r, i) => (
                  <div
                    key={i}
                    className="p-1.5 bg-down/10 border border-down/30 text-down text-[10px] rounded"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: TreeSHAP Feature Attribution Waterfall (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-1">
            <span className="text-[11px] font-bold text-accent uppercase">
              TreeSHAP Feature Contributions
            </span>
            <span className="text-[10px] text-text-faint">
              Local Explainability Vector
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedScenario.shapDrivers.map((driver, idx) => {
              const isPositive = driver.impact > 0;
              const barWidth = Math.min(100, Math.abs(driver.impact) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text font-medium">{driver.feature}</span>
                    <span className="text-text-faint text-[10px]">{driver.value}</span>
                  </div>

                  {/* SHAP Bar */}
                  <div className="h-2 w-full bg-bg-elevated border border-border flex relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-border-strong z-10" />
                    {isPositive ? (
                      <div
                        className="h-full bg-down transition-all duration-300"
                        style={{ width: `${barWidth / 2}%`, marginLeft: "50%" }}
                      />
                    ) : (
                      <div
                        className="h-full bg-up transition-all duration-300"
                        style={{
                          width: `${barWidth / 2}%`,
                          marginLeft: `${50 - barWidth / 2}%`,
                        }}
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-[9px] text-text-faint">
                    <span>{isPositive ? "Increases Fraud Risk &rarr;" : "&larr; Protects / Normal"}</span>
                    <span className={isPositive ? "text-down font-bold" : "text-up font-bold"}>
                      {isPositive ? `+${driver.impact.toFixed(2)}` : driver.impact.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border text-[10px] text-text-faint leading-relaxed">
            *TreeSHAP computes exact Shapley values for tree ensembles in polynomial time. Positive contributions push composite risk towards BLOCK; negative values pull towards APPROVE.
          </div>
        </div>
      </div>

      {/* Footer Link Out */}
      <div className="flex items-center justify-between text-[10px] text-text-faint pt-1 border-t border-border">
        <span>SAMPLE SCENARIO &middot; Not live model output</span>
        <a
          href="https://github.com/ahmadmdsajid129/real-time-payment-fraud-detection"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:brightness-125 flex items-center gap-1 transition-all"
        >
          <span>View Kafka &amp; Redis Pipeline in Repo</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
