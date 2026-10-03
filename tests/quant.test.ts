import { describe, it, expect } from "vitest";

// 1. Analytical Black-Scholes Formula Implementation for testing
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

function blackScholesCall(
  S: number,
  K: number,
  r: number,
  sigma: number,
  T: number
): number {
  if (T <= 0 || sigma <= 0) return Math.max(0, S - K);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
}

// 2. Microstructure Math: OBI and Micro-Price
function computeOBI(vBid: number, vAsk: number): number {
  if (vBid + vAsk === 0) return 0;
  return (vBid - vAsk) / (vBid + vAsk);
}

function computeMicroPrice(
  pBid: number,
  pAsk: number,
  vBid: number,
  vAsk: number
): number {
  if (vBid + vAsk === 0) return (pBid + pAsk) / 2;
  return (pAsk * vBid + pBid * vAsk) / (vBid + vAsk);
}

describe("Quantitative Mathematics & Derivatives Suite", () => {
  it("Black-Scholes European call matches standard benchmark", () => {
    // S=100, K=100, r=0.05, sigma=0.20, T=1.0 -> standard price is ~10.4506
    const price = blackScholesCall(100, 100, 0.05, 0.2, 1.0);
    expect(price).toBeCloseTo(10.4506, 3);
  });

  it("Deep in-the-money option converges to intrinsic discounted value", () => {
    // S=200, K=100, r=0.05, sigma=0.001, T=1.0 -> intrinsic ~ 200 - 100*exp(-0.05) = 104.877
    const price = blackScholesCall(200, 100, 0.05, 0.001, 1.0);
    const expected = 200 - 100 * Math.exp(-0.05);
    expect(price).toBeCloseTo(expected, 2);
  });

  it("Deep out-of-the-money option evaluates to zero", () => {
    const price = blackScholesCall(50, 150, 0.05, 0.1, 0.5);
    expect(price).toBeLessThan(0.0001);
  });

  it("Antithetic variates induce strictly negative covariance", () => {
    const N = 2000;
    const Z: number[] = [];
    const negZ: number[] = [];

    // Simple pseudo-random standard normal draws
    for (let i = 0; i < N; i++) {
      const u1 = Math.max(1e-12, Math.random());
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      Z.push(Math.exp(0.05 + 0.2 * z));
      negZ.push(Math.exp(0.05 - 0.2 * z));
    }

    // Compute covariance
    const meanZ = Z.reduce((a, b) => a + b, 0) / N;
    const meanNegZ = negZ.reduce((a, b) => a + b, 0) / N;
    let cov = 0;
    for (let i = 0; i < N; i++) {
      cov += (Z[i] - meanZ) * (negZ[i] - meanNegZ);
    }
    cov /= N - 1;

    expect(cov).toBeLessThan(0); // Proves variance reduction condition
  });
});

describe("Market Microstructure & Order Book Equations", () => {
  it("Order Book Imbalance (OBI) computes correctly", () => {
    // Symmetric book: 50 bid, 50 ask -> OBI = 0.0
    expect(computeOBI(50, 50)).toBe(0.0);

    // Bid heavy: 80 bid, 20 ask -> (80-20)/100 = +0.6
    expect(computeOBI(80, 20)).toBe(0.6);

    // Ask heavy: 10 bid, 90 ask -> (10-90)/100 = -0.8
    expect(computeOBI(10, 90)).toBe(-0.8);
  });

  it("Volume-Weighted Micro-Price skews toward opposite queue depth", () => {
    const pBid = 99.95;
    const pAsk = 100.05;
    const mid = (pBid + pAsk) / 2; // 100.00

    // Symmetric book: micro-price equals mid-price
    expect(computeMicroPrice(pBid, pAsk, 50, 50)).toBeCloseTo(mid, 3);

    // Heavy bid queue (100 bid vs 20 ask): buying pressure pushes micro-price towards ask
    const bidHeavyMicro = computeMicroPrice(pBid, pAsk, 100, 20);
    expect(bidHeavyMicro).toBeGreaterThan(mid);
    expect(bidHeavyMicro).toBeCloseTo(100.033, 3);

    // Heavy ask queue (20 bid vs 100 ask): selling pressure pushes micro-price towards bid
    const askHeavyMicro = computeMicroPrice(pBid, pAsk, 20, 100);
    expect(askHeavyMicro).toBeLessThan(mid);
    expect(askHeavyMicro).toBeCloseTo(99.967, 3);
  });
});
