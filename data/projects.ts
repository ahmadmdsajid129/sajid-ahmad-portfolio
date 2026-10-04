export type ProjectType = "Quant" | "ML" | "Full-Stack";

export interface MetricItem {
  label: string;
  value: string;
  change?: string;
  highlight?: boolean;
}

export interface HonestyBadge {
  label: string;
  verified: boolean;
}

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  code: string;
  type: ProjectType;
  title: string;
  dateRange: string;
  status: string;
  featured?: boolean;
  repoUrl?: string;
  clientRepoPrivate?: boolean;
  liveDemoUrl?: string;
  oneLiner: string;
  stack: string[];
  metrics: MetricItem[];
  honestyBadges: HonestyBadge[];
  highlights?: string[];
  howThisCouldBeWrong: string[];
  nextSteps: string[];
  reproduceCommands: string[];
  interviewQAs: InterviewQA[];
}

export const projectsData: ProjectData[] = [
  {
    id: "prj-001",
    slug: "lob-alpha-simulator",
    code: "PRJ-001",
    type: "Quant",
    title: "LOB Alpha Simulator & Market-Making Engine",
    dateRange: "April 2026",
    status: "COMPLETE | OOS EVALUATED",
    featured: true,
    repoUrl: "https://github.com/ahmadmdsajid129/lob-alpha-simulator",
    oneLiner:
      "Event-driven limit order book simulator with microstructure features, an XGBoost alpha model, and a market-making backtest that accounts for adverse selection.",
    stack: ["Python 3.11", "NumPy", "Pandas", "scikit-learn", "XGBoost", "Matplotlib"],
    metrics: [
      { label: "OOS ACC", value: "~67%", highlight: true },
      { label: "EVENTS", value: "5,000" },
      { label: "FILL (WIN)", value: "35%" },
      { label: "QUOTE THRESH", value: ">60%" },
    ],
    honestyBadges: [
      { label: "SYNTHETIC DATA", verified: true },
      { label: "COSTS/FRICTIONS MODELLED", verified: true },
      { label: "OUT-OF-SAMPLE (chronological split)", verified: true },
      { label: "REAL EXCHANGE DATA", verified: false },
    ],
    highlights: [
      "Event-driven LOB reconstruction with microsecond FIFO queue matching",
      "Vectorized Order Flow Imbalance (OFI) & level-2 book pressure alpha features",
      "Avellaneda-Stoikov market-making execution with adverse selection penalty",
    ],
    howThisCouldBeWrong: [
      "Data is synthetic: the ~67% accuracy reflects the simulator's internal stochastic dynamics, not real-world market complexity.",
      "The 35% winning quote / 100% losing quote fill rates are stylized heuristic assumptions, not empirical queue-position fill measurements.",
      "No latency or network transmission modelling: zero slippage is assumed between signal emission and order arrival at the exchange queue.",
      "Accuracy alone is not an executable trading metric: Sharpe ratio, maximum drawdown, and turnover distributions require full empirical reporting [[PLACEHOLDER: add from your run]].",
      "Results represent a single simulation run without bootstrap confidence intervals or statistical hypothesis significance testing.",
    ],
    nextSteps: [
      "Replace synthetic market maker feed with real L2/L3 historical tick data (e.g. LOBSTER academic dataset or crypto exchange WebSockets).",
      "Model realistic queue priority and order-cancellation dynamics per FIFO queue depth.",
      "Report annualized Sharpe and Maximum Drawdown with 95% bootstrap confidence intervals across market regimes.",
      "Incorporate dynamic inventory risk limits (Avellaneda-Stoikov or Guéant framework).",
    ],
    reproduceCommands: [
      "git clone https://github.com/ahmadmdsajid129/lob-alpha-simulator.git",
      "cd lob-alpha-simulator",
      "python -m venv venv && source venv/bin/activate  # on Windows: venv\\Scripts\\activate",
      "pip install -r requirements.txt",
      "python main.py",
    ],
    interviewQAs: [
      {
        question: "Why did crossing the spread destroy your initial alpha?",
        answer:
          "The naive backtest assumed instantaneous mid-price execution. In reality, aggressive orders must cross the spread and pay taker fees. If the expected forward price move is 2 ticks but the half-spread plus taker fee is 2.5 ticks, every trade has negative expected value despite 67% directional accuracy.",
      },
      {
        question: "Why use collections.deque instead of Python lists or heaps for the book?",
        answer:
          "Limit order books require strict FIFO priority at each price level. collections.deque provides O(1) appends for incoming limit orders and O(1) pops for queue-head fills or cancellations, avoiding the O(N) memory shift overhead of Python lists.",
      },
      {
        question: "Why was a chronological split mandatory instead of K-Fold cross validation?",
        answer:
          "Financial tick data exhibits strong autocorrelation. Random shuffling causes severe temporal look-ahead leakage, allowing the model to train on future microstructure state and test on past state.",
      },
      {
        question: "How did you model adverse selection in passive quoting?",
        answer:
          "By imposing asymmetric fill rates: winning quotes (where price moves favorably) filled only ~35% of the time due to queue competition, while toxic flow filled losing quotes 100% of the time.",
      },
    ],
  },
  {
    id: "prj-002",
    slug: "exotic-options-pricer",
    code: "PRJ-002",
    type: "Quant",
    title: "Exotic Options Pricing Engine + Web Client",
    dateRange: "Jan 2026",
    status: "COMPLETE | CLIENT-SERVER",
    featured: true,
    repoUrl: "https://github.com/ahmadmdsajid129/exotic-options-pricer",
    liveDemoUrl: "https://github.com/ahmadmdsajid129/exotic-options-client",
    oneLiner:
      "Vectorized Monte Carlo engine pricing path-dependent derivatives under GBM, with variance reduction and Greeks, served by FastAPI and visualized in a Next.js dashboard.",
    stack: [
      "Python 3.11",
      "NumPy",
      "SciPy",
      "FastAPI",
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Recharts",
    ],
    metrics: [
      { label: "MC PATHS", value: "100,000", highlight: true },
      { label: "BS vs MC ERR", value: "0.0068" },
      { label: "ASIAN DELTA", value: "0.5896" },
      { label: "ASIAN VEGA", value: "0.2156" },
    ],
    honestyBadges: [
      { label: "MODEL: GBM (constant vol)", verified: true },
      { label: "CLOSED-FORM VALIDATION", verified: true },
      { label: "STOCHASTIC VOL", verified: false },
      { label: "MARKET DATA CALIBRATION", verified: false },
    ],
    highlights: [
      "Vectorized antithetic variates & geometric Brownian motion paths in NumPy",
      "Exact Black-Scholes closed-form validation benchmarks (error < 0.007)",
      "Real-time risk Greeks (Delta, Gamma, Vega) via pathwise differentiation",
    ],
    howThisCouldBeWrong: [
      "GBM assumes constant volatility and no price jumps, failing to reproduce volatility smiles and skews observed in real derivative markets.",
      "The down-and-out barrier is monitored discretely at simulation time steps. Discrete monitoring makes the barrier look less likely to be breached than in continuous time, biasing the estimated price upward.",
      "Greeks calculated via central finite differences with independent random draws suffer from high variance unless Common Random Numbers (CRN) are strictly maintained [[PLACEHOLDER: confirm whether seeds are fixed]].",
      "The sample output does not report the standard error or 95% confidence interval alongside the point estimate.",
    ],
    nextSteps: [
      "Report standard error and variance reduction ratios side-by-side for all estimators.",
      "Upgrade the diffusion kernel from GBM to Heston Stochastic Volatility and Local Volatility models.",
      "Implement American options pricing using Longstaff-Schwartz Least Squares Monte Carlo (LSM).",
      "Port the inner path-generation kernel to C++ with OpenMP or Numba JIT for multi-core parallelism.",
    ],
    reproduceCommands: [
      "# Backend (FastAPI Pricing Service)",
      "git clone https://github.com/ahmadmdsajid129/exotic-options-pricer.git",
      "cd exotic-options-pricer && python -m venv venv && source venv/bin/activate",
      "pip install -r requirements.txt",
      "uvicorn api:app --reload --port 8000",
      "# Client (Next.js Dashboard)",
      "git clone https://github.com/ahmadmdsajid129/exotic-options-client.git",
      "cd exotic-options-client && npm install",
      "npm run dev",
    ],
    interviewQAs: [
      {
        question: "Why do antithetic variates reduce Monte Carlo variance?",
        answer:
          "By simulating paired paths using Z and -Z, the payoffs are negatively correlated: Cov(f(Z), f(-Z)) < 0. The variance of their average Var((f(Z)+f(-Z))/2) = (Var(f(Z)) + Cov(f(Z), f(-Z)))/2, which is strictly less than Var(f(Z))/2.",
      },
      {
        question: "Why use an arithmetic Asian option for testing control variates?",
        answer:
          "Arithmetic Asian options have no analytical closed-form solution. Geometric Asian options or European calls do. We use the closed-form instrument as a control variate to soak up correlated simulation noise without introducing bias.",
      },
      {
        question: "Why does discrete monitoring bias a down-and-out barrier price upward?",
        answer:
          "Because the underlying path can cross the barrier between discrete monitoring time steps and recover before the next step. Discrete monitoring misses these crossings, leading to an artificially higher survival rate and an upward price bias.",
      },
      {
        question: "Why use Common Random Numbers (CRN) when calculating Greeks via finite difference?",
        answer:
          "Central differences evaluate (V(S+h) - V(S-h))/(2h). If independent random paths are drawn for S+h and S-h, simulation variance dominates the small step h. Using the same random seed cancels out path-level noise.",
      },
    ],
  },
  {
    id: "prj-003",
    slug: "real-time-payment-fraud-detection",
    code: "PRJ-003",
    type: "ML",
    title: "Real-Time Payment Fraud Detection & Risk Engine",
    dateRange: "2024",
    status: "COMPLETE | 61/61 TESTS",
    featured: true,
    repoUrl: "https://github.com/ahmadmdsajid129/real-time-payment-fraud-detection",
    oneLiner:
      "Streaming fraud-scoring pipeline combining calibrated XGBoost, Isolation Forest, Redis sliding-window features, Kafka, and TreeSHAP explainability, with a React 19 forensic dashboard.",
    stack: [
      "Python 3.11+",
      "FastAPI",
      "XGBoost",
      "scikit-learn",
      "Isolation Forest",
      "SHAP",
      "Redis",
      "Kafka",
      "PostgreSQL",
      "Prometheus",
      "Docker",
      "React 19",
      "Tailwind CSS",
      "Vite",
    ],
    metrics: [
      { label: "PR-AUC", value: "0.9825", highlight: true },
      { label: "TOTAL p95", value: "92.24ms" },
      { label: "TESTS PASS", value: "61/61" },
      { label: "ECE", value: "0.0014" },
    ],
    honestyBadges: [
      { label: "SYNTHETIC DATA", verified: true },
      { label: "NO TEMPORAL LEAKAGE", verified: true },
      { label: "CALIBRATED", verified: true },
      { label: "REAL CARD DATA", verified: false },
      { label: "PCI-DSS CERTIFIED", verified: false },
    ],
    highlights: [
      "Sub-100ms p95 streaming inference combining calibrated XGBoost & Isolation Forest",
      "Redis ZSET sliding-window retrospective behavioral profiling with zero leakage",
      "TreeSHAP explainability engine providing real-time local risk attributions",
    ],
    howThisCouldBeWrong: [
      "The dataset contains synthetic transactions. Real payment networks exhibit adversarial fraud evolution, making PR-AUC ≈ 0.98 unrepresentative of live production fraud rates.",
      "The held-out test set contains 2,250 transactions with ~50 fraud cases, resulting in relatively wide binomial confidence intervals around precision and recall.",
      "The chargeback / analyst label feedback loop is simulated synchronously; in real banks, fraud labels take 30 to 90 days to arrive from card networks.",
      "The measured single-threaded throughput of 15.0 TPS is suitable for demonstration, but production payment rails require distributed batching, ONNX Runtime, or Triton inference servers.",
    ],
    nextSteps: [
      "Benchmark against public real-world datasets (e.g. IEEE-CIS Fraud Detection or Credit Card Fraud Kaggle).",
      "Export XGBoost and Isolation Forest models to ONNX Runtime with TensorRT for sub-5ms GPU/C++ inference.",
      "Simulate delayed label arrivals (30/60/90 day maturation windows) to stress-test continual learning loops.",
      "Deploy distributed Kafka consumer groups with partitioned Redis clusters.",
    ],
    reproduceCommands: [
      "git clone https://github.com/ahmadmdsajid129/real-time-payment-fraud-detection.git",
      "cd real-time-payment-fraud-detection",
      "docker compose up -d",
      "python -m venv venv && source venv/bin/activate",
      "pip install -r requirements.txt",
      "pytest tests -v",
      "python services/api/main.py",
    ],
    interviewQAs: [
      {
        question: "Why did you choose XGBoost over Random Forest if RF had a higher PR-AUC (0.9858 vs 0.9825)?",
        answer:
          "Model selection in fraud requires balancing multiple objectives. While Random Forest scored slightly higher PR-AUC on this split, Champion XGBoost delivered superior F1 (0.9431 vs 0.9107), significantly better Recall (0.9508 vs 0.8361), lower Brier score (0.0023 vs 0.0032), and substantially faster TreeSHAP explanation latency.",
      },
      {
        question: "Why is probability calibration necessary after training XGBoost?",
        answer:
          "Raw gradient boosting scores reflect ranking ability rather than true empirical probabilities. Isotonic regression calibration aligns predicted probabilities with observed event frequencies, improving the Brier score from 0.0023 to 0.0018 and achieving an Expected Calibration Error (ECE) of 0.0014.",
      },
      {
        question: "How did you prevent temporal data leakage in streaming feature engineering?",
        answer:
          "All features use strictly retrospective sliding windows in Redis ZSETs (1m, 5m, 1h, 24h) and Welford incremental statistics. State updates are committed only after the inference decision is returned, preventing the current transaction from biasing its own z-score.",
      },
      {
        question: "What is your measured latency, and why do you not claim sub-80ms p95?",
        answer:
          "Because honest measurement matters. Under 250 simulated transactions, feature enrichment took p95 32.04ms, inference and TreeSHAP took p95 39.88ms, and arbitration took 0.10ms. The total end-to-end HTTP round trip p95 was measured at 92.24ms (mean 66.40ms, p50 65.59ms, p90 89.66ms). It satisfies a 100ms SLA, but claiming sub-80ms p95 would be mathematically false.",
      },
    ],
  },
  {
    id: "prj-004",
    slug: "himavogue-ecommerce",
    code: "PRJ-004",
    type: "Full-Stack",
    title: "HimaVogue: Multi-Vendor E-Commerce & Atelier",
    dateRange: "Aug 2025 - July 2026",
    status: "COMPLETE | CLIENT WORK",
    featured: false,
    liveDemoUrl: "https://www.himavogue.com/",
    clientRepoPrivate: true,
    oneLiner:
      "Production multi-vendor marketplace & bespoke tailoring atelier (himavogue.com) built on Next.js 14 (App Router) and MongoDB, with a multi-vendor escrow ledger, split-order logistics, an eSewa cryptographic payment pipeline, and k6 load-tested checkout concurrency.",
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "MongoDB",
      "Mongoose 8",
      "Redis",
      "Cloudflare R2",
      "eSewa Gateway",
      "k6 Testing",
      "JWT/jose",
      "Tailwind CSS",
      "Framer Motion",
      "Docker",
    ],
    metrics: [
      { label: "FRAMEWORK", value: "Next.js 14" },
      { label: "LOAD-TESTED", value: "k6 Verified", highlight: true },
      { label: "PAYMENT RAILS", value: "eSewa Verified" },
      { label: "ROLES", value: "User / Seller / Admin" },
    ],
    honestyBadges: [
      { label: "REAL CLIENT PROJECT", verified: true },
      { label: "PAYMENT VERIFIED SERVER-SIDE", verified: true },
      { label: "LOAD-TESTED", verified: true },
      { label: "AUTOMATED TEST SUITE", verified: false },
    ],
    highlights: [
      "Bespoke Stitching Atelier: Custom tailoring measurement engine & partner boutique routing (Classic Boutique Kathmandu)",
      "Multi-Vendor Escrow Ledger: T+7 return window escrow holding with automated seller commission clearance",
      "Server-Verified eSewa Rails: Zero client price trust, cryptographic HMAC checksum verification & conflict rejection",
      "Production Load-Tested: Stress-tested high-concurrency cart and checkout pipeline on Next.js 14 & Redis",
    ],
    howThisCouldBeWrong: [
      "Rate limiting is implemented using in-memory Maps, which reset upon server process restart and do not synchronize state across multi-instance deployments (should be moved to Redis).",
      "Wallet point deductions and draft order generation are not wrapped in an atomic MongoDB multi-document transaction; mid-flight exceptions rely on manual refund catch blocks.",
      "Variants and sizes do not have stable immutable _id identifiers, causing cart and order references to rely on descriptive names.",
      "Custom tailoring measurement inputs lack strict server-side bounding and range validation.",
      "The 7-day access token lifetime is relatively long for a secure stateless access token.",
      "Payment finalization in dropped browser redirect scenarios requires asynchronous reconciliation jobs or administrative review.",
      "The overselling guard logs mismatches and triggers cron refunds rather than atomically blocking checkout concurrency at the DB level.",
    ],
    nextSteps: [
      "Implement Redis-backed sliding-window rate limiting (ioredis token bucket).",
      "Enforce atomic MongoDB two-phase commit transactions for the checkout pipeline.",
      "Refactor inventory variants with stable sub-document ObjectIds.",
      "Scale automated k6 load testing suites to benchmark 2,000+ virtual users across high-concurrency flash sale spikes.",
    ],
    reproduceCommands: [
      "# Private repository - Environment setup instructions",
      "npm install",
      "# Requires MongoDB and Redis instances active",
      "docker compose up -d",
      "npm run dev",
      "# Required Environment Variable Names (never commit secrets):",
      "# MONGODB_URI, REDIS_URL, ESEWA_MERCHANT_CODE, ESEWA_SECRET_KEY, JWT_SECRET",
    ],
    interviewQAs: [
      {
        question: "How did you ensure checkout integrity against client-side price tampering?",
        answer:
          "All order pricing is strictly recomputed on the server from the authoritative MongoDB catalog. Client-submitted prices are treated solely as verification checksums; any price divergence immediately rejects the request with HTTP 409 Conflict.",
      },
      {
        question: "How is eSewa payment callback spoofing prevented?",
        answer:
          "Redirect callbacks from the payment gateway are never trusted. The server makes an independent, encrypted server-to-server HTTP request to eSewa's verification endpoint to confirm status='COMPLETE', matching transaction ID and exact currency amount.",
      },
      {
        question: "How does the multi-vendor escrow settlement work?",
        answer:
          "Vendor earnings (item price minus default 10% commission) land in a pendingClearance bucket. Funds settle into the vendor's wallet balance only after order delivery plus the expiration of the customer return window.",
      },
      {
        question: "How did you validate checkout concurrency and prevent stock overselling?",
        answer:
          "We conducted automated k6 load tests simulating concurrent checkout surges. Inventory reservations are decremented through atomic findAndModify checks against stock levels, while Redis holds temporary cart locks during payment gateway redirection to prevent inventory double-booking.",
      },
    ],
  },
];
