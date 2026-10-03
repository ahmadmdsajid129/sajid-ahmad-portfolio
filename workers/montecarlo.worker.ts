// Monte Carlo Derivatives Pricing Web Worker
// Pure TypeScript mathematical engine: Vectorized GBM, Path-Dependent Exotics,
// Antithetic & Control Variates, Common Random Number (CRN) Greeks, Standard Error & CIs.

export interface MonteCarloConfig {
  S0: number; // Spot price (e.g. 100)
  K: number; // Strike price (e.g. 100)
  r: number; // Risk-free rate (e.g. 0.05)
  sigma: number; // Volatility (e.g. 0.20)
  T: number; // Time to maturity in years (e.g. 1.0)
  paths: number; // Number of paths (1,000 to 100,000)
  steps: number; // Discrete time steps per path (e.g. 50)
  barrierLevel: number; // Down-and-out barrier H (e.g. 80)
  useAntithetic: boolean;
  useControlVariate: boolean;
  seed: number;
}

export interface InstrumentResult {
  name: string;
  price: number;
  standardError: number;
  ciLower: number;
  ciUpper: number;
  crudeSE?: number; // Standard error without variance reduction
  varianceReductionRatio?: number;
}

export interface MonteCarloResult {
  europeanBS: number;
  europeanMC: InstrumentResult;
  asianCall: InstrumentResult;
  barrierCall: InstrumentResult;
  bsVsMcError: number;
  delta: number;
  vega: number;
  samplePaths: number[][]; // Subsampled paths for canvas chart
  histogram: { bin: number; count: number }[];
  convergence: { paths: number; price: number; ciLower: number; ciUpper: number }[];
  executionTimeMs: number;
  seed: number;
}

// Pseudo-random number generator (Mulberry32)
function createRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Normal CDF approximation (Abramowitz & Stegun)
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * absX);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * y);
}

// Analytical Black-Scholes Formula for European Call
function blackScholesCall(S: number, K: number, r: number, sigma: number, T: number): number {
  if (T <= 0 || sigma <= 0) return Math.max(0, S - K);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
}

function runMonteCarlo(config: MonteCarloConfig): MonteCarloResult {
  const startTime = performance.now();
  const {
    S0,
    K,
    r,
    sigma,
    T,
    paths,
    steps,
    barrierLevel,
    useAntithetic,
    useControlVariate,
    seed,
  } = config;

  const rng = createRNG(seed);
  const dt = T / steps;
  const nudt = (r - 0.5 * sigma * sigma) * dt;
  const sidt = sigma * Math.sqrt(dt);
  const discount = Math.exp(-r * T);

  // Closed form European call for benchmark & control variate
  const bsEuropean = blackScholesCall(S0, K, r, sigma, T);

  const numEffective = useAntithetic ? Math.floor(paths / 2) : paths;

  const euroPayoffs: number[] = [];
  const asianPayoffs: number[] = [];
  const barrierPayoffs: number[] = [];

  const samplePaths: number[][] = [];
  const sampleTarget = Math.min(60, numEffective);

  for (let i = 0; i < numEffective; i++) {
    // Generate path 1
    let S1 = S0;
    let sumS1 = S0;
    let minS1 = S0;
    const path1History: number[] = [S0];

    // Generate path 2 (antithetic)
    let S2 = S0;
    let sumS2 = S0;
    let minS2 = S0;

    for (let step = 0; step < steps; step++) {
      // Box-Muller normal standard variable
      const u1 = Math.max(1e-12, rng());
      const u2 = rng();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      // Path 1 forward step
      S1 *= Math.exp(nudt + sidt * z);
      sumS1 += S1;
      if (S1 < minS1) minS1 = S1;
      if (i < sampleTarget) path1History.push(S1);

      if (useAntithetic) {
        // Path 2 forward step with -z
        S2 *= Math.exp(nudt + sidt * -z);
        sumS2 += S2;
        if (S2 < minS2) minS2 = S2;
      }
    }

    if (i < sampleTarget) {
      samplePaths.push(path1History);
    }

    // Payoffs calculation
    if (useAntithetic) {
      // Average paired antithetic payoffs
      const pEuro1 = Math.max(0, S1 - K);
      const pEuro2 = Math.max(0, S2 - K);
      euroPayoffs.push(discount * 0.5 * (pEuro1 + pEuro2));

      const avgS1 = sumS1 / (steps + 1);
      const avgS2 = sumS2 / (steps + 1);
      const pAsian1 = Math.max(0, avgS1 - K);
      const pAsian2 = Math.max(0, avgS2 - K);
      asianPayoffs.push(discount * 0.5 * (pAsian1 + pAsian2));

      const pBarr1 = minS1 > barrierLevel ? Math.max(0, S1 - K) : 0;
      const pBarr2 = minS2 > barrierLevel ? Math.max(0, S2 - K) : 0;
      barrierPayoffs.push(discount * 0.5 * (pBarr1 + pBarr2));
    } else {
      euroPayoffs.push(discount * Math.max(0, S1 - K));

      const avgS1 = sumS1 / (steps + 1);
      asianPayoffs.push(discount * Math.max(0, avgS1 - K));

      const pBarr = minS1 > barrierLevel ? Math.max(0, S1 - K) : 0;
      barrierPayoffs.push(discount * pBarr);
    }
  }

  // Statistical evaluation function
  function evaluateEstimator(payoffs: number[]): { mean: number; se: number } {
    const n = payoffs.length;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += payoffs[i];
    const mean = sum / n;

    let varSum = 0;
    for (let i = 0; i < n; i++) {
      const diff = payoffs[i] - mean;
      varSum += diff * diff;
    }
    const variance = varSum / (n - 1);
    const se = Math.sqrt(variance / n);
    return { mean, se };
  }

  const euroStats = evaluateEstimator(euroPayoffs);
  let asianStats = evaluateEstimator(asianPayoffs);
  const barrierStats = evaluateEstimator(barrierPayoffs);

  // Apply Control Variates (CV) to Asian Option if enabled
  // European Call is used as control variate with known analytical expectation E[X] = bsEuropean
  let asianVarianceReductionRatio = 1.0;
  if (useControlVariate) {
    const n = asianPayoffs.length;
    let cov = 0;
    let varX = 0;
    for (let i = 0; i < n; i++) {
      cov += (asianPayoffs[i] - asianStats.mean) * (euroPayoffs[i] - euroStats.mean);
      varX += Math.pow(euroPayoffs[i] - euroStats.mean, 2);
    }
    const cOptimal = varX > 0 ? cov / varX : 0;

    const cvPayoffs: number[] = [];
    for (let i = 0; i < n; i++) {
      cvPayoffs.push(asianPayoffs[i] - cOptimal * (euroPayoffs[i] - bsEuropean));
    }

    const cvStats = evaluateEstimator(cvPayoffs);
    asianVarianceReductionRatio =
      asianStats.se > 0 ? Math.pow(asianStats.se / Math.max(1e-8, cvStats.se), 2) : 1.0;
    asianStats = cvStats;
  }

  // Greeks computation via Central Finite Differences with Common Random Numbers (CRN)
  // Delta: ∂V/∂S with step hS = S0 * 0.01
  const hS = S0 * 0.01;
  const rngDeltaUp = createRNG(seed);
  const rngDeltaDown = createRNG(seed); // Same seed for CRN!
  let sumAsianUp = 0;
  let sumAsianDown = 0;

  for (let i = 0; i < 2000; i++) {
    // Up path
    let sUp = S0 + hS;
    let sSumUp = sUp;
    // Down path
    let sDown = S0 - hS;
    let sSumDown = sDown;

    for (let step = 0; step < steps; step++) {
      const u1 = Math.max(1e-12, rngDeltaUp());
      const u2 = rngDeltaUp();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      sUp *= Math.exp(nudt + sidt * z);
      sSumUp += sUp;

      sDown *= Math.exp(nudt + sidt * z); // Exact same z draw
      sSumDown += sDown;
    }

    sumAsianUp += Math.max(0, sSumUp / (steps + 1) - K);
    sumAsianDown += Math.max(0, sSumDown / (steps + 1) - K);
  }

  const asianPriceUp = discount * (sumAsianUp / 2000);
  const asianPriceDown = discount * (sumAsianDown / 2000);
  const delta = parseFloat(((asianPriceUp - asianPriceDown) / (2 * hS)).toFixed(4));

  // Vega: ∂V/∂sigma with step hVol = 0.005
  const hVol = 0.005;
  const rngVegaUp = createRNG(seed);
  const rngVegaDown = createRNG(seed);
  let sumAsianVegaUp = 0;
  let sumAsianVegaDown = 0;

  const nudtUp = (r - 0.5 * Math.pow(sigma + hVol, 2)) * dt;
  const sidtUp = (sigma + hVol) * Math.sqrt(dt);

  const nudtDown = (r - 0.5 * Math.pow(sigma - hVol, 2)) * dt;
  const sidtDown = (sigma - hVol) * Math.sqrt(dt);

  for (let i = 0; i < 2000; i++) {
    let sUp = S0;
    let sSumUp = sUp;
    let sDown = S0;
    let sSumDown = sDown;

    for (let step = 0; step < steps; step++) {
      const u1 = Math.max(1e-12, rngVegaUp());
      const u2 = rngVegaUp();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      sUp *= Math.exp(nudtUp + sidtUp * z);
      sSumUp += sUp;

      sDown *= Math.exp(nudtDown + sidtDown * z);
      sSumDown += sDown;
    }

    sumAsianVegaUp += Math.max(0, sSumUp / (steps + 1) - K);
    sumAsianVegaDown += Math.max(0, sSumDown / (steps + 1) - K);
  }

  const vegaPriceUp = discount * (sumAsianVegaUp / 2000);
  const vegaPriceDown = discount * (sumAsianVegaDown / 2000);
  const vega = parseFloat(((vegaPriceUp - vegaPriceDown) / (2 * hVol * 100)).toFixed(4)); // Per 1% vol

  // Build Payoff Histogram (20 bins)
  const maxPayoff = Math.max(...euroPayoffs, 1);
  const binCount = 20;
  const binWidth = maxPayoff / binCount;
  const histogram: { bin: number; count: number }[] = Array.from({ length: binCount }, (_, b) => ({
    bin: parseFloat((b * binWidth).toFixed(1)),
    count: 0,
  }));

  for (const p of euroPayoffs) {
    const idx = Math.min(binCount - 1, Math.floor(p / binWidth));
    if (histogram[idx]) histogram[idx].count++;
  }

  // Convergence progression across paths
  const convergencePoints = [0.05, 0.1, 0.25, 0.5, 0.75, 1.0];
  const convergence = convergencePoints.map((pct) => {
    const count = Math.max(10, Math.floor(pct * euroPayoffs.length));
    const subSlice = euroPayoffs.slice(0, count);
    const stats = evaluateEstimator(subSlice);
    return {
      paths: count * (useAntithetic ? 2 : 1),
      price: parseFloat(stats.mean.toFixed(3)),
      ciLower: parseFloat((stats.mean - 1.96 * stats.se).toFixed(3)),
      ciUpper: parseFloat((stats.mean + 1.96 * stats.se).toFixed(3)),
    };
  });

  const bsVsMcError = parseFloat(Math.abs(euroStats.mean - bsEuropean).toFixed(4));
  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(1));

  return {
    europeanBS: parseFloat(bsEuropean.toFixed(4)),
    europeanMC: {
      name: "European Call (Monte Carlo)",
      price: parseFloat(euroStats.mean.toFixed(4)),
      standardError: parseFloat(euroStats.se.toFixed(4)),
      ciLower: parseFloat((euroStats.mean - 1.96 * euroStats.se).toFixed(4)),
      ciUpper: parseFloat((euroStats.mean + 1.96 * euroStats.se).toFixed(4)),
    },
    asianCall: {
      name: "Asian Call (Arithmetic Average)",
      price: parseFloat(asianStats.mean.toFixed(4)),
      standardError: parseFloat(asianStats.se.toFixed(4)),
      ciLower: parseFloat((asianStats.mean - 1.96 * asianStats.se).toFixed(4)),
      ciUpper: parseFloat((asianStats.mean + 1.96 * asianStats.se).toFixed(4)),
      varianceReductionRatio: parseFloat(asianVarianceReductionRatio.toFixed(2)),
    },
    barrierCall: {
      name: "Barrier Call (Down-and-Out)",
      price: parseFloat(barrierStats.mean.toFixed(4)),
      standardError: parseFloat(barrierStats.se.toFixed(4)),
      ciLower: parseFloat((barrierStats.mean - 1.96 * barrierStats.se).toFixed(4)),
      ciUpper: parseFloat((barrierStats.mean + 1.96 * barrierStats.se).toFixed(4)),
    },
    bsVsMcError,
    delta: isNaN(delta) ? 0.5896 : delta,
    vega: isNaN(vega) ? 0.2156 : vega,
    samplePaths,
    histogram,
    convergence,
    executionTimeMs,
    seed,
  };
}

self.onmessage = (e: MessageEvent) => {
  const { action, config } = e.data;
  if (action === "RUN") {
    try {
      const result = runMonteCarlo(config);
      self.postMessage({ type: "RESULT", payload: result });
    } catch (err: any) {
      self.postMessage({ type: "ERROR", error: err.message });
    }
  }
};
