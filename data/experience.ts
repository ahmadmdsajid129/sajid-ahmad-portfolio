export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  dateRange: string;
  type: "Contract" | "Full-time" | "Competition" | "Open Source";
  bullets: string[];
  techStack: string[];
  metricsPlaceholder?: string;
}

export const experienceData: ExperienceItem[] = [
  {
    id: "exp-001",
    role: "Full-Stack Software Engineer (Freelance)",
    organization: "HimaVogue Multi-Vendor Marketplace",
    location: "Remote",
    dateRange: "Aug 2025 - July 2026",
    type: "Contract",
    bullets: [
      "Architected and deployed a multi-vendor marketplace using Next.js 14 (App Router) and MongoDB, supporting user, vendor, and admin roles.",
      "Engineered an escrow payment pipeline integrating eSewa with strict server-to-server transaction verification to prevent client-side callback forgery.",
      "Implemented concurrency-safe inventory decrements on nested variants using atomic MongoDB $inc operations with $gte balance guards to eliminate overselling.",
      "Built a parent-child split-order fulfillment engine that pro-rates coupons, discounts, and delivery fees proportionally by vendor item value.",
      "Configured Redis cache-aside caching with wildcard pattern invalidation, falling back gracefully to MongoDB upon cache misses.",
      "Structured wallet point ledgers into expiring FIFO batches, ensuring immediate deduction during draft checkout to block cross-tab double-spending.",
      "Containerized the complete web, database, and Redis runtime into a production-grade 3-stage Docker multi-architecture deployment.",
    ],
    techStack: [
      "Next.js 14",
      "React 18",
      "MongoDB",
      "Mongoose",
      "Redis",
      "Docker",
      "eSewa Gateway",
      "TypeScript",
    ],
    metricsPlaceholder:
      "Outcome metrics: [[PLACEHOLDER: orders processed, revenue transacted, production uptime]]",
  },
  {
    id: "exp-002",
    role: "Quantitative Systems & Risk Researcher (Independent)",
    organization: "Open-Source Quantitative Research",
    location: "Remote",
    dateRange: "2024 - 2026",
    type: "Open Source",
    bullets: [
      "Engineered an event-driven limit order book simulator in Python featuring FIFO queue mechanics, Order Book Imbalance (OBI) tracking, and XGBoost alpha signals.",
      "Developed a vectorized Monte Carlo derivatives valuation engine pricing European, Asian, and Barrier options with antithetic and control variate variance reduction.",
      "Built an end-to-end streaming fraud detection engine with calibrated XGBoost, Isolation Forest anomaly scoring, Redis sliding windows, and 61/61 automated tests.",
      "Authored exhaustive post-mortems documenting execution frictions, temporal look-ahead leakage prevention, and model limitations.",
    ],
    techStack: [
      "Python 3.11",
      "NumPy",
      "Pandas",
      "SciPy",
      "XGBoost",
      "FastAPI",
      "Redis",
      "Kafka",
      "Docker",
    ],
  },
  {
    id: "exp-003",
    role: "Quantitative Research & Algorithm Competitions",
    organization: "Competitive Coding & Modeling",
    location: "Global",
    dateRange: "2023 - 2024",
    type: "Competition",
    bullets: [
      "Participated in algorithmic coding and quantitative modeling challenges [[PLACEHOLDER: add competitions, rankings, and hackathons]].",
      "Built modular mathematical solvers for combinatorial optimization and numerical root-finding routines.",
    ],
    techStack: ["Python", "Algorithms", "C++", "Data Structures"],
    metricsPlaceholder: "Achievements: [[PLACEHOLDER: add competition badges, contest ratings]]",
  },
];
