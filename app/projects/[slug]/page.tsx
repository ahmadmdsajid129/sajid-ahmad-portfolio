import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectsData } from "@/data/projects";
import { CodeBlock } from "@/components/code-block";
import { ProjectCardVisual } from "@/components/project-card-visual";
import { MonteCarloLab } from "@/components/monte-carlo-lab";
import { FraudReplay } from "@/components/fraud-replay";
import { ThompsonSimulator } from "@/components/thompson-simulator";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Terminal,
  CheckCircle,
  Copy,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Metadata } from "next";

export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) return { title: "Tearsheet Not Found" };
  return {
    title: `${project.code}: ${project.title} | Tearsheet`,
    description: project.oneLiner,
  };
}

export default function ProjectTearsheetPage({ params }: { params: { slug: string } }) {
  const projectIndex = projectsData.findIndex((p) => p.slug === params.slug);
  if (projectIndex === -1) {
    notFound();
  }

  const project = projectsData[projectIndex];
  const prevProject = projectIndex > 0 ? projectsData[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projectsData.length - 1 ? projectsData[projectIndex + 1] : null;

  return (
    <div className="py-12 space-y-12 max-w-[1000px] mx-auto font-sans">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between font-mono text-xs border-b border-border pb-4">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-accent hover:brightness-125 font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; ALL PROJECTS / TEARSHEETS</span>
        </Link>
        <div className="flex items-center gap-4 text-text-faint">
          {prevProject && (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="hover:text-accent transition-colors"
            >
              &larr; {prevProject.code}
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="hover:text-accent transition-colors"
            >
              {nextProject.code} &rarr;
            </Link>
          )}
        </div>
      </div>

      {/* 1. Header Row */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 bg-accent text-bg font-bold">{project.code}</span>
          <span className="px-2 py-0.5 bg-bg-elevated border border-border text-text-muted">
            {project.type}
          </span>
          <span className="text-text-faint">&middot;</span>
          <span className="text-text-muted">{project.dateRange}</span>
          <span className="text-text-faint">&middot;</span>
          <span className="text-up font-semibold">{project.status}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-text tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-lg text-text-muted leading-relaxed font-normal">
          {project.oneLiner}
        </p>

        {/* Stack Chips & Action Links */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-bg-inset border border-border text-text-muted text-[11px]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-accent text-bg font-bold rounded flex items-center gap-1.5 hover:brightness-110 active:scale-98 transition-all"
              >
                <span>VIEW REPOSITORY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.clientRepoPrivate && (
              <span className="px-2.5 py-1 bg-bg-inset border border-border text-text-faint text-[11px]">
                CODE: PRIVATE (client work)
              </span>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-up text-bg font-bold rounded flex items-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-bg animate-pulse" />
                <span>{project.id === "prj-004" ? "VISIT LIVE STORE (himavogue.com)" : "CLIENT REPO"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* 2. TL;DR Executive Box */}
      <section className="terminal-panel p-6 bg-bg-elevated border-l-4 border-l-accent border-border space-y-3 font-mono text-xs">
        <div className="text-accent font-bold text-sm uppercase tracking-wide">
          TL;DR | EXECUTIVE SUMMARY
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-text-muted leading-relaxed">
          <div>
            <span className="text-text font-semibold block mb-1 uppercase text-[10px] text-text-faint">
              What I Did:
            </span>
            {project.id === "prj-001" &&
              "Built an event-driven limit order book in Python with FIFO queue structures, generated microstructure signals (OBI, micro-price), and trained an XGBoost alpha model with strict chronological splits."}
            {project.id === "prj-002" &&
              "Developed a pure NumPy vectorized Monte Carlo pricing engine for path-dependent exotics (Asian, Barrier) with antithetic/control variate variance reduction and Greeks."}
            {project.id === "prj-003" &&
              "Engineered an end-to-end streaming fraud scoring pipeline with Redis sliding windows, calibrated XGBoost, Isolation Forest, and TreeSHAP explainability."}
            {project.id === "prj-004" &&
              "Architected a production multi-vendor marketplace with server-verified escrow payments, split-order logistics, and concurrency-guarded inventory."}
          </div>
          <div>
            <span className="text-text font-semibold block mb-1 uppercase text-[10px] text-text-faint">
              Main Result:
            </span>
            {project.id === "prj-001" &&
              "Achieved ~67% out-of-sample directional accuracy on synthetic order flow and demonstrated that passive MM with adverse selection filters survives where naive execution dies."}
            {project.id === "prj-002" &&
              "Monte Carlo priced a 100K-path European call within 0.0068 (0.065%) of closed-form Black-Scholes, and reduced Asian option variance via control variates."}
            {project.id === "prj-003" &&
              "Champion XGBoost delivered 0.9825 PR-AUC, 0.9431 F1, and ECE of 0.0014 on held-out chronological test data, with a measured end-to-end p95 round-trip of 92.24ms."}
            {project.id === "prj-004" &&
              "Delivered zero client-side price tampering vulnerabilities with 100% server-side recalculation and atomic eSewa gateway verification."}
          </div>
          <div>
            <span className="text-text font-semibold block mb-1 uppercase text-[10px] text-text-faint">
              Main Caveat:
            </span>
            {project.id === "prj-001" &&
              "Data is synthetic; the ~67% accuracy reflects internal simulator dynamics rather than live markets. Fill rates (35% win, 100% loss) are stylized assumptions."}
            {project.id === "prj-002" &&
              "GBM assumes constant volatility with no smile/skew; discrete barrier monitoring creates an upward price bias versus continuous monitoring."}
            {project.id === "prj-003" &&
              "Synthetic transaction generation means PR-AUC ≈ 0.98 is far above real production card networks; test set contains 2,250 rows (~50 frauds)."}
            {project.id === "prj-004" &&
              "Rate limiting currently uses in-memory Maps; checkout wallet deduction and order creation are not yet wrapped in a single multi-document MongoDB transaction."}
          </div>
        </div>
      </section>

      {/* 2b. Core Capabilities & Key Highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="terminal-panel p-6 bg-bg-elevated border border-border space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-accent font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>CORE CAPABILITIES &amp; HIGHLIGHTS</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-text">
            {project.highlights.map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2.5 bg-bg-inset border border-border/80 rounded"
              >
                <span className="text-accent font-bold mt-0.5 select-none">&rsaquo;</span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Visual Chart / Demonstration Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-text">MODEL VISUALIZATION</h2>
        <ProjectCardVisual slug={project.slug} />
        <div className="text-[10px] font-mono text-text-faint">
          *Backtests and simulations are hypothetical. See &ldquo;How this could be wrong&rdquo; below for exhaustive assumptions and caveats.
        </div>
      </section>

      {/* Flagship Interactive Engine for PRJ-002 */}
      {project.id === "prj-002" && (
        <section className="space-y-4">
          <MonteCarloLab />
        </section>
      )}

      {/* Flagship Interactive Replay for PRJ-003 */}
      {project.id === "prj-003" && (
        <section className="space-y-4">
          <FraudReplay />
        </section>
      )}

      {/* Flagship Interactive Thompson Sampling for PRJ-004 */}
      {project.id === "prj-004" && (
        <section className="space-y-4">
          <ThompsonSimulator />
        </section>
      )}

      {/* Real Sample Output for PRJ-002 */}
      {project.id === "prj-002" && (
        <section className="terminal-panel p-4 bg-bg-inset border border-border font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-text-faint border-b border-border pb-1 text-[11px]">
            <span className="text-accent font-bold">TERMINAL OUTPUT | SAMPLE RUN, 100,000 PATHS</span>
            <span>NUMPY KERNEL</span>
          </div>
          <pre className="text-text leading-relaxed text-[12px]">
{`European Call (Black-Scholes): 10.4506
European Call (Monte Carlo):   10.4574
Barrier Call (Down & Out):     10.0429
Asian Call (Optimized CV):      5.7404
Asian Delta: 0.5896    Asian Vega: 0.2156`}
          </pre>
          <div className="text-[11px] text-text-muted pt-1 border-t border-border/40">
            Note: MC vs analytic Black-Scholes differ by <strong>0.0068 (0.065%)</strong>. Parameters: S=100, K=100, r=5%, &sigma;=20%, T=1.
          </div>
        </section>
      )}

      {/* Results Leaderboard Table for PRJ-003 */}
      {project.id === "prj-003" && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-heading text-text">
            CHRONOLOGICAL TEST SET BENCHMARK (2,250 TRANSACTIONS, 2.25% FRAUD)
          </h2>
          <div className="overflow-x-auto terminal-panel border border-border">
            <table className="w-full text-left font-mono text-xs tabular-nums">
              <thead className="bg-bg-elevated border-b border-border text-text-faint text-[11px]">
                <tr>
                  <th className="p-3">MODEL</th>
                  <th className="p-3 text-right">PR-AUC</th>
                  <th className="p-3 text-right">ROC-AUC</th>
                  <th className="p-3 text-right">F1 SCORE</th>
                  <th className="p-3 text-right">RECALL</th>
                  <th className="p-3 text-right">PRECISION</th>
                  <th className="p-3 text-right">BRIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="hover:bg-bg-inset">
                  <td className="p-3 text-text-faint">Dummy baseline</td>
                  <td className="p-3 text-right">0.0271</td>
                  <td className="p-3 text-right">0.5000</td>
                  <td className="p-3 text-right">0.0000</td>
                  <td className="p-3 text-right">0.0000</td>
                  <td className="p-3 text-right">0.0000</td>
                  <td className="p-3 text-right">0.0264</td>
                </tr>
                <tr className="hover:bg-bg-inset">
                  <td className="p-3 text-text">Logistic Regression</td>
                  <td className="p-3 text-right">0.9222</td>
                  <td className="p-3 text-right">0.9947</td>
                  <td className="p-3 text-right">0.6186</td>
                  <td className="p-3 text-right text-up">0.9836</td>
                  <td className="p-3 text-right">0.4511</td>
                  <td className="p-3 text-right">0.0320</td>
                </tr>
                <tr className="hover:bg-bg-inset">
                  <td className="p-3 text-text">Random Forest</td>
                  <td className="p-3 text-right text-accent font-bold">0.9858</td>
                  <td className="p-3 text-right">0.9989</td>
                  <td className="p-3 text-right">0.9107</td>
                  <td className="p-3 text-right">0.8361</td>
                  <td className="p-3 text-right text-up font-bold">1.0000</td>
                  <td className="p-3 text-right">0.0032</td>
                </tr>
                <tr className="bg-accent/10 border-l-2 border-l-accent font-semibold">
                  <td className="p-3 text-accent">Champion XGBoost</td>
                  <td className="p-3 text-right">0.9825</td>
                  <td className="p-3 text-right text-up font-bold">0.9990</td>
                  <td className="p-3 text-right text-up font-bold">0.9431</td>
                  <td className="p-3 text-right text-up font-bold">0.9508</td>
                  <td className="p-3 text-right">0.9355</td>
                  <td className="p-3 text-right text-up font-bold">0.0023</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[11px] font-mono text-text-muted p-3 bg-bg-inset border border-border">
            <strong>Honest Evaluation Note:</strong> Random Forest achieved a marginally higher PR-AUC (0.9858 vs 0.9825) and perfect precision on this slice. Champion XGBoost was selected because of its significantly higher F1 (0.9431), essential fraud recall (0.9508 vs 0.8361), lower calibrated Brier score (0.0018 post-isotonic), and significantly faster TreeSHAP execution latency.
          </div>

          {/* Measured Latency Table */}
          <div className="pt-4 space-y-2">
            <h3 className="text-base font-bold font-heading text-text">
              MEASURED LATENCY (250 LIVE SIMULATED TRANSACTIONS)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-3 bg-bg-inset border border-border rounded">
                <div className="text-text-faint text-[10px]">FEATURE ENRICHMENT</div>
                <div className="text-lg font-bold text-text">p95 32.04ms</div>
              </div>
              <div className="p-3 bg-bg-inset border border-border rounded">
                <div className="text-text-faint text-[10px]">INFERENCE + SHAP</div>
                <div className="text-lg font-bold text-text">p95 39.88ms</div>
              </div>
              <div className="p-3 bg-bg-inset border border-border rounded">
                <div className="text-text-faint text-[10px]">RISK ARBITRATION</div>
                <div className="text-lg font-bold text-text">p95 0.10ms</div>
              </div>
              <div className="p-3 bg-bg-inset border border-accent rounded">
                <div className="text-accent text-[10px]">TOTAL HTTP ROUND TRIP</div>
                <div className="text-lg font-bold text-accent">p95 92.24ms</div>
                <div className="text-[9px] text-text-faint">Mean 66.40ms &middot; p50 65.59ms</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Problem / Hypothesis */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold font-heading text-text">PROBLEM &amp; HYPOTHESIS</h2>
        <div className="text-sm text-text-muted leading-relaxed space-y-2">
          {project.id === "prj-001" && (
            <p>
              High-frequency limit order books carry short-term directional predictability through Order Book Imbalance (OBI) and micro-price skew. However, naive backtests that assume instantaneous mid-price execution produce entirely spurious alpha: crossing the bid-ask spread and incurring exchange taker fees immediately annihilates theoretical edge. The hypothesis tested here is that XGBoost-predicted queue pressure can be harnessed effectively only by pivoting to <em>passive liquidity provision</em>, provided that quotes are dynamically withdrawn when model probability exceeds an adverse-selection threshold.
            </p>
          )}
          {project.id === "prj-002" && (
            <p>
              Exotic path-dependent options (such as arithmetic Asian and down-and-out barrier contracts) lack closed-form analytic solutions. While standard crude Monte Carlo converges slowly at rate O(1/&radic;N), applying variance reduction techniques (Antithetic variates and closed-form European Black-Scholes control variates) can dramatically shrink estimator standard error for identical computational path budgets.
            </p>
          )}
          {project.id === "prj-003" && (
            <p>
              Real-time payment fraud detection requires scoring high-velocity card swipes under strict latency SLAs (under 100ms) with extreme class imbalance (&lt;3% fraud). The architecture hypothesizes that combining retrospective sliding-window behavioural features (Redis ZSETs) with calibrated gradient boosting, unsupervised anomaly scoring (Isolation Forest), and TreeSHAP explainability produces optimal risk arbitration without temporal look-ahead leakage.
            </p>
          )}
          {project.id === "prj-004" && (
            <p>
              Full-stack multi-vendor marketplaces require enterprise checkout integrity: preventing client-side price tampering, managing distributed vendor escrows, and ensuring atomic stock reservations under concurrent traffic. The implementation tests a resilient server-authoritative pattern where all catalog totals, coupons, and gateway callbacks are validated server-side.
            </p>
          )}
        </div>
      </section>

      {/* 4. Methodology & Illustrative Code Snippets */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-text">METHODOLOGY &amp; CODE SNIPPET</h2>
        {project.id === "prj-001" && (
          <CodeBlock
            language="python"
            label="FIFO QUEUE MATCHING ENGINE LEVEL"
            code={`from collections import deque

class OrderBookLevel:
    """FIFO queue representing resting liquidity at a discrete price level."""
    def __init__(self, price: float):
        self.price = price
        self.orders = deque()  # Strict FIFO queue of (order_id, size)
        self.total_volume = 0

    def add_order(self, order_id: str, size: int) -> None:
        self.orders.append((order_id, size))
        self.total_volume += size

    def fill_order(self, requested_size: int) -> int:
        filled = 0
        while self.orders and filled < requested_size:
            order_id, order_size = self.orders[0]
            remaining_needed = requested_size - filled
            if order_size <= remaining_needed:
                filled += order_size
                self.orders.popleft()
            else:
                self.orders[0] = (order_id, order_size - remaining_needed)
                filled += remaining_needed
        self.total_volume -= filled
        return filled`}
          />
        )}
        {project.id === "prj-002" && (
          <CodeBlock
            language="python"
            label="VECTORIZED ANTITHETIC MONTE CARLO DIFFUSION"
            code={`import numpy as np

def simulate_gbm_antithetic(S0, r, sigma, T, num_paths, steps):
    """Vectorized GBM simulation pairing Z with -Z for variance reduction."""
    dt = T / steps
    half_paths = num_paths // 2
    
    # Generate standard normal increments
    Z = np.random.standard_normal((half_paths, steps))
    # Antithetic pair: [Z, -Z] induces exact negative covariance
    Z_full = np.vstack([Z, -Z])
    
    # Vectorized drift and diffusion
    nudt = (r - 0.5 * sigma**2) * dt
    sidt = sigma * np.sqrt(dt)
    log_returns = nudt + sidt * Z_full
    
    # Cumulative trajectory accumulation
    paths = np.empty((num_paths, steps + 1))
    paths[:, 0] = S0
    paths[:, 1:] = S0 * np.exp(np.cumsum(log_returns, axis=1))
    return paths`}
          />
        )}
        {project.id === "prj-003" && (
          <CodeBlock
            language="python"
            label="WELFORD ONLINE INCREMENTAL Z-SCORE TRACKER"
            code={`class WelfordVelocityTracker:
    """Computes incremental mean and variance without temporal look-ahead leakage."""
    def __init__(self):
        self.count = 0
        self.mean = 0.0
        self.M2 = 0.0

    def update(self, x: float) -> None:
        self.count += 1
        delta = x - self.mean
        self.mean += delta / self.count
        delta2 = x - self.mean
        self.M2 += delta * delta2

    def get_z_score(self, x: float) -> float:
        if self.count < 2:
            return 0.0
        variance = self.M2 / (self.count - 1)
        stdev = variance ** 0.5
        return (x - self.mean) / stdev if stdev > 1e-6 else 0.0`}
          />
        )}
        {project.id === "prj-004" && (
          <CodeBlock
            language="typescript"
            label="SERVER-AUTHORITATIVE CHECKOUT CHECKSUM"
            code={`export async function verifyOrderIntegrity(req: OrderRequest, db: Database) {
  // 1. Fetch live catalog pricing directly from database
  const catalogItems = await db.items.find({ _id: { $in: req.itemIds } });
  
  // 2. Authoritative server price recalculation
  let serverTotal = 0;
  for (const item of req.items) {
    const dbItem = catalogItems.find(c => c._id.equals(item.id));
    if (!dbItem) throw new Error("ITEM_NOT_FOUND");
    serverTotal += dbItem.price * item.quantity;
  }

  // 3. Reject any client price mismatch with HTTP 409
  if (Math.abs(serverTotal - req.clientClaimedTotal) > 0.01) {
    throw new SecurityException("PRICE_CHECKSUM_TAMPER_DETECTED", 409);
  }
  return serverTotal;
}`}
          />
        )}
      </section>

      {/* 5. How This Could Be Wrong (Prominent Amber Warning) */}
      <section className="terminal-panel p-6 bg-bg-elevated border-l-4 border-l-warn border-border space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-warn font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>HOW THIS COULD BE WRONG | ASSUMPTIONS &amp; LIMITATIONS</span>
        </div>
        <p className="text-text-muted leading-relaxed">
          Quantitative honesty requires explicitly stating every structural assumption and model limitation. The following caveats apply to this tearsheet:
        </p>
        <ul className="space-y-2 text-text">
          {project.howThisCouldBeWrong.map((caveat, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-warn font-bold mt-0.5">&bull;</span>
              <span className="leading-relaxed">{caveat}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. What I Would Do Next */}
      <section className="space-y-3 font-mono text-xs">
        <h2 className="text-xl font-bold font-heading text-text">WHAT I WOULD DO NEXT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {project.nextSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 bg-bg-inset border border-border rounded flex items-start gap-2.5"
            >
              <span className="text-accent font-bold text-xs">{idx + 1}.</span>
              <span className="text-text-muted leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Exact Reproduction Steps */}
      <section className="space-y-3 font-mono text-xs">
        <h2 className="text-xl font-bold font-heading text-text">REPRODUCE IT</h2>
        <p className="text-text-muted">
          Exact terminal commands to clone, configure virtual environment, and run the pipeline locally:
        </p>
        <div className="terminal-panel p-4 bg-bg-inset border border-border space-y-1 text-text leading-relaxed">
          {project.reproduceCommands.map((cmd, idx) => (
            <div key={idx} className={cmd.startsWith("#") ? "text-text-faint" : "text-accent"}>
              {cmd}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Interview Talking Points (Collapsed <details>) */}
      <section className="space-y-4 font-mono text-xs">
        <h2 className="text-xl font-bold font-heading text-text">
          INTERVIEW TALKING POINTS &amp; DEFENSE
        </h2>
        <div className="space-y-2">
          {project.interviewQAs.map((qa, idx) => (
            <details
              key={idx}
              className="terminal-panel border border-border bg-bg-elevated p-3 rounded group cursor-pointer"
            >
              <summary className="font-semibold text-text group-hover:text-accent transition-colors flex items-center justify-between">
                <span>{qa.question}</span>
                <ChevronRight className="w-3.5 h-3.5 text-text-faint group-open:rotate-90 transition-transform" />
              </summary>
              <div className="pt-3 mt-2 border-t border-border/50 text-text-muted leading-relaxed">
                {qa.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
