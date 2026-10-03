# Sajid Ahmad // Quantitative Research & Systems Terminal

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-6%2F6%20Passing-brightgreen?style=flat)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Status-Open%20to%20Roles-00D68F?style=flat)](#)

A production-ready quantitative research portfolio engineered as a high-density financial research terminal. Designed specifically for quantitative researchers, algorithmic traders, and hiring managers at systematic hedge funds and proprietary trading firms.

**Live Terminal:** [https://github.com/ahmadmdsajid129/sajid-ahmad-portfolio](https://github.com/ahmadmdsajid129/sajid-ahmad-portfolio)

---

## Key Differentiators & Interactive Simulations

1. **Limit Order Book Simulator (`LOB:SIM`):**
   - Background **Web Worker** running 10-level continuous bid/ask books with FIFO queues per price level.
   - Live **Order Book Imbalance (OBI)** meter and **Volume-weighted micro-price** tracking.
   - Real-time 120-tick canvas mid-price trajectory.

2. **In-Browser Monte Carlo Derivatives Pricer:**
   - Vectorized Geometric Brownian Motion (GBM) simulation up to 100,000 paths without UI jank.
   - **Antithetic Variates** and analytical European Call **Control Variates** variance reduction with side-by-side SE comparisons.
   - Central finite difference Greeks (Delta $\partial V/\partial S$, Vega $\partial V/\partial \sigma$) with synchronized **Common Random Numbers (CRN)**.

3. **Market-Maker Adverse Selection Game:**
   - Interactive order flow simulation adjusting half-spread and inventory skew coefficients (Avellaneda-Stoikov model) under informed trading flow bursts.

4. **Forensic Fraud Risk Pipeline Replay:**
   - 4 realistic attack scenarios (Normal, Velocity Burst, Impossible Travel, Account Takeover) with composite risk arbitration (0-100) and **TreeSHAP** feature attribution waterfalls.

5. **Bayesian Thompson-Sampling Bandit Simulator:**
   - Adaptive dynamic allocation minimizing cumulative regret compared to static 50/50 A/B testing.

---

## Tech Stack & Design System

- **Framework:** Next.js 14 (App Router, Standalone Output), React 18, TypeScript strict mode.
- **Styling:** Vanilla Tailwind CSS with CSS variable tokens (Terminal Dark default, Paper Light mode, Phosphor CRT scanline easter egg).
- **Concurrency:** Dedicated Web Workers for mathematical simulations (`workers/orderbook.worker.ts`, `workers/montecarlo.worker.ts`, `workers/marketmaker.worker.ts`).
- **Typography:** Space Grotesk (Headings), Inter (Body), JetBrains Mono (Tabular numerals).
- **Testing:** Vitest for mathematical derivatives equations and microstructure calculations.
- **Cryptographic Audit:** Web Crypto API (`crypto.subtle.digest`) SHA-256 forward-testing verification.

---

## Keyboard Navigation & Terminal Hotkeys

| Key | Action |
|---|---|
| `Ctrl+K` or `/` | Open Bloomberg-style Command Palette |
| `1` - `6` | Jump to sections (About, Projects, Live, Research, Education, Contact) |
| `J` / `K` | Smooth scroll to Next / Previous section |
| `T` | Toggle Color Theme (Terminal Dark &harr; Paper Light) |
| `P` | Toggle Retro Phosphor CRT Green Scanlines (Easter Egg) |
| `?` | Open Terminal Shortcuts Manual |
| `Esc` | Dismiss any open modal or command palette |

---

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/ahmadmdsajid129/sajid-ahmad-portfolio.git
cd sajid-ahmad-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run mathematical unit tests
```bash
npm test
```

### 5. Build for production
```bash
npm run build
```

---

## Vercel Deployment

Deploy with zero configuration on Vercel:

```bash
npm i -g vercel
vercel
```

Or connect the repository `ahmadmdsajid129/sajid-ahmad-portfolio` directly in the Vercel Dashboard. All routes are pre-rendered statically with standalone output.
