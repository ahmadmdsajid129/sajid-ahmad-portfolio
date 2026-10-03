export interface AntiPortfolioEntry {
  id: string;
  idea: string;
  statusStamp: "COSTS KILLED IT" | "DEAD" | "OVERFIT" | "NO EDGE OOS";
  cause: string;
  lesson: string;
  inSampleMetric: string;
  outOfSampleMetric: string;
  projectLink?: string;
  noteLink?: string;
}

export interface ResearchNoteMeta {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
}

export const antiPortfolioEntries: AntiPortfolioEntry[] = [
  {
    id: "anti-001",
    idea: "Naive mid-price execution on the LOB XGBoost model",
    statusStamp: "COSTS KILLED IT",
    cause:
      "Backtested execution assumed fill at mid-price with zero spread and zero taker fees. Once crossing the half-spread and paying exchange fees was factored in, the directional edge evaporated.",
    lesson:
      "Always model execution frictions from Day 1. Pivoted to passive market making with adverse selection thresholds (>60% model confidence to quote).",
    inSampleMetric: "Sharpe 3.84 (Naive)",
    outOfSampleMetric: "Sharpe -0.92 (Frictions)",
    projectLink: "/projects/lob-alpha-simulator",
    noteLink: "/content/notes/why-crossing-spread-destroyed-alpha",
  },
  {
    id: "anti-002",
    idea: "High-degree polynomial features for order book depth extrapolation",
    statusStamp: "OVERFIT",
    cause:
      "Trained 4th-order polynomial interactions on queue depth. In-sample fit was stellar, but out-of-sample prediction failed completely during liquidity shocks.",
    lesson:
      "Financial microstructure is heavily non-stationary; high-order interactions fit noise. Shifted to tree-based monotonic splits and OBI ratios.",
    inSampleMetric: "Train R² 0.81",
    outOfSampleMetric: "Test R² -0.14",
    projectLink: "/projects/lob-alpha-simulator",
  },
  {
    id: "anti-003",
    idea: "Uncalibrated deep tree ensemble for fraud risk scoring",
    statusStamp: "NO EDGE OOS",
    cause:
      "Raw leaf probabilities clustered aggressively near 0 and 1, creating massive confidence skew and disastrous Expected Calibration Error.",
    lesson:
      "Pure ranking metric (ROC-AUC) masks probability distortion. Probability calibration via isotonic regression is mandatory for financial risk thresholds.",
    inSampleMetric: "ECE 0.084 (Raw)",
    outOfSampleMetric: "ECE 0.0014 (Calibrated)",
    projectLink: "/projects/real-time-payment-fraud-detection",
    noteLink: "/content/notes/why-fraud-model-needed-calibration",
  },
  {
    id: "anti-004",
    idea: "[[PLACEHOLDER: Crude finite difference Greeks without Common Random Numbers]]",
    statusStamp: "DEAD",
    cause:
      "Evaluating central finite differences using independent random paths produced noisy Greeks where simulation variance overpowered the differential step.",
    lesson:
      "Common Random Numbers (CRN) are essential for derivative sensitivities to eliminate path-level variance between bump scenarios.",
    inSampleMetric: "Std Error 0.28 (Indep)",
    outOfSampleMetric: "Std Error 0.012 (CRN)",
    projectLink: "/projects/exotic-options-pricer",
    noteLink: "/content/notes/antithetic-vs-control-variates",
  },
];

export const researchNotesList: ResearchNoteMeta[] = [
  {
    slug: "why-crossing-spread-destroyed-alpha",
    title: "Why Crossing the Spread Destroyed My Alpha",
    date: "2024-11-15",
    readTime: "4 min read",
    tags: ["Microstructure", "Execution Costs", "LOB"],
    summary:
      "How a naive mid-price assumption masked a fatal flaw in high-frequency order book modeling, and why passive quoting with adverse-selection filters salvaged the strategy.",
  },
  {
    slug: "antithetic-vs-control-variates",
    title: "Antithetic vs Control Variates: What Actually Reduced My Standard Error",
    date: "2024-10-28",
    readTime: "5 min read",
    tags: ["Monte Carlo", "Variance Reduction", "Derivatives"],
    summary:
      "An empirical comparison of antithetic pairs versus analytical Black-Scholes control variates when pricing path-dependent Asian options under Geometric Brownian Motion.",
  },
  {
    slug: "why-fraud-model-needed-calibration",
    title: "Why My Fraud Model Needed Probability Calibration",
    date: "2024-09-12",
    readTime: "3 min read",
    tags: ["Machine Learning", "Calibration", "Risk Systems"],
    summary:
      "Why high ROC-AUC is misleading when setting real dollar risk thresholds, and how isotonic regression reduced Brier score and Expected Calibration Error.",
  },
];
