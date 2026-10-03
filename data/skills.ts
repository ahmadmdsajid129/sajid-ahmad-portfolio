export interface SkillFactor {
  name: string;
  category: "Quant & Math" | "Engineering" | "Machine Learning" | "Financial Systems";
  exposure: number; // 0 to 100
  evidence: string;
  projectSlug: string;
}

export const skillsData: SkillFactor[] = [
  // Quant & Math
  {
    name: "Monte Carlo Simulation",
    category: "Quant & Math",
    exposure: 92,
    evidence: "Used in: Exotic Options Pricer (100K paths, vectorized GBM)",
    projectSlug: "exotic-options-pricer",
  },
  {
    name: "Variance Reduction (Antithetic & CV)",
    category: "Quant & Math",
    exposure: 88,
    evidence: "Used in: Exotic Options Pricer (Black-Scholes analytical anchor)",
    projectSlug: "exotic-options-pricer",
  },
  {
    name: "Market Microstructure & Order Flow",
    category: "Quant & Math",
    exposure: 85,
    evidence: "Used in: LOB Alpha Simulator (OBI, FIFO matching queues)",
    projectSlug: "lob-alpha-simulator",
  },
  {
    name: "Derivatives Greeks (Delta, Vega)",
    category: "Quant & Math",
    exposure: 82,
    evidence: "Used in: Exotic Options Pricer (Central differences + CRN)",
    projectSlug: "exotic-options-pricer",
  },
  {
    name: "Stochastic Processes (GBM)",
    category: "Quant & Math",
    exposure: 86,
    evidence: "Used in: Options Pricer & LOB Fair Value Walk",
    projectSlug: "exotic-options-pricer",
  },

  // Machine Learning
  {
    name: "Gradient Boosting (XGBoost)",
    category: "Machine Learning",
    exposure: 94,
    evidence: "Used in: Real-Time Fraud Engine & LOB Alpha Classifier",
    projectSlug: "real-time-payment-fraud-detection",
  },
  {
    name: "Probability Calibration (Isotonic / ECE)",
    category: "Machine Learning",
    exposure: 90,
    evidence: "Used in: Fraud Engine (ECE 0.0014, Brier 0.0018)",
    projectSlug: "real-time-payment-fraud-detection",
  },
  {
    name: "Anomaly Detection (Isolation Forest)",
    category: "Machine Learning",
    exposure: 84,
    evidence: "Used in: Fraud Engine (Dual-layer anomaly scoring)",
    projectSlug: "real-time-payment-fraud-detection",
  },
  {
    name: "Model Explainability (TreeSHAP)",
    category: "Machine Learning",
    exposure: 86,
    evidence: "Used in: Fraud Engine (Real-time attribution waterfall)",
    projectSlug: "real-time-payment-fraud-detection",
  },
  {
    name: "Temporal Leakage Prevention (OOS Split)",
    category: "Machine Learning",
    exposure: 95,
    evidence: "Used in: LOB Alpha Simulator (Strict chronological split)",
    projectSlug: "lob-alpha-simulator",
  },

  // Engineering
  {
    name: "Python (NumPy, SciPy, Pandas)",
    category: "Engineering",
    exposure: 94,
    evidence: "Used in: LOB Simulator & Monte Carlo Engine",
    projectSlug: "lob-alpha-simulator",
  },
  {
    name: "FastAPI & High-Throughput APIs",
    category: "Engineering",
    exposure: 88,
    evidence: "Used in: Options Pricer & Fraud Ingestion Service",
    projectSlug: "real-time-payment-fraud-detection",
  },
  {
    name: "Redis (ZSET Sliding Windows & Caching)",
    category: "Engineering",
    exposure: 90,
    evidence: "Used in: Fraud Feature Store & HimaVogue Cache-Aside",
    projectSlug: "real-time-payment-fraud-detection",
  },
  {
    name: "Next.js 14, TypeScript & React",
    category: "Engineering",
    exposure: 92,
    evidence: "Used in: Portfolio, Options Dashboard & HimaVogue",
    projectSlug: "himavogue-ecommerce",
  },
  {
    name: "Docker & Container Architecture",
    category: "Engineering",
    exposure: 84,
    evidence: "Used in: Fraud Detection Compose & HimaVogue 3-Stage Build",
    projectSlug: "real-time-payment-fraud-detection",
  },

  // Financial Systems
  {
    name: "Adverse Selection & Quoting Dynamics",
    category: "Financial Systems",
    exposure: 86,
    evidence: "Used in: LOB Simulator (Passive market-maker backtest)",
    projectSlug: "lob-alpha-simulator",
  },
  {
    name: "Payment Gateway Verification (Server-to-Server)",
    category: "Financial Systems",
    exposure: 90,
    evidence: "Used in: HimaVogue (eSewa server-authoritative integrity)",
    projectSlug: "himavogue-ecommerce",
  },
  {
    name: "Escrow & Settlement Ledgers",
    category: "Financial Systems",
    exposure: 85,
    evidence: "Used in: HimaVogue (Multi-vendor clearance accounting)",
    projectSlug: "himavogue-ecommerce",
  },
];
