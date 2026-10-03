export interface GlossaryTerm {
  term: string;
  shortName: string;
  definition: string;
}

export const glossaryTerms: Record<string, GlossaryTerm> = {
  Sharpe: {
    term: "Sharpe Ratio",
    shortName: "Sharpe",
    definition:
      "Excess return per unit of total risk (standard deviation). Penalizes both upside and downside volatility.",
  },
  Sortino: {
    term: "Sortino Ratio",
    shortName: "Sortino",
    definition:
      "Excess return divided by downside deviation. Unlike Sharpe, it does not penalize positive volatility.",
  },
  "Max DD": {
    term: "Maximum Drawdown",
    shortName: "Max DD",
    definition:
      "The largest peak-to-trough decline in portfolio equity before a new peak is reached.",
  },
  "PR-AUC": {
    term: "Precision-Recall AUC",
    shortName: "PR-AUC",
    definition:
      "Area under the Precision-Recall curve. The definitive evaluation metric for severely imbalanced fraud/classification data.",
  },
  "ROC-AUC": {
    term: "Receiver Operating Characteristic AUC",
    shortName: "ROC-AUC",
    definition:
      "Area under the true positive rate vs false positive rate curve across all discrimination thresholds.",
  },
  Brier: {
    term: "Brier Score",
    shortName: "Brier",
    definition:
      "Mean squared difference between predicted probabilities and actual binary outcomes (0 to 1). Lower is better.",
  },
  ECE: {
    term: "Expected Calibration Error",
    shortName: "ECE",
    definition:
      "Weighted average difference between model confidence and actual empirical accuracy across prediction bins.",
  },
  PSI: {
    term: "Population Stability Index",
    shortName: "PSI",
    definition:
      "Measure of distribution shift between reference and current feature distributions. PSI > 0.25 signals severe drift.",
  },
  OBI: {
    term: "Order Book Imbalance",
    shortName: "OBI",
    definition:
      "Ratio of normalized difference between top bid and ask depth: (V_bid - V_ask) / (V_bid + V_ask).",
  },
  "Micro-price": {
    term: "Volume-Weighted Micro-Price",
    shortName: "Micro-price",
    definition:
      "Fair price estimate weighting best bid and ask by opposite queue depth: (P_ask*V_bid + P_bid*V_ask)/(V_bid + V_ask).",
  },
  "Adverse selection": {
    term: "Adverse Selection",
    shortName: "Adverse selection",
    definition:
      "Tendency for limit orders to get filled predominantly when informed traders move the price against you.",
  },
  "Antithetic variates": {
    term: "Antithetic Variates",
    shortName: "Antithetic variates",
    definition:
      "Variance reduction method pairing each random draw Z with -Z to induce negative correlation and cancel variance.",
  },
  "Control variates": {
    term: "Control Variates",
    shortName: "Control variates",
    definition:
      "Variance reduction technique anchoring a simulated estimator to a correlated instrument with known closed-form solution.",
  },
  Delta: {
    term: "Delta (Δ)",
    shortName: "Delta",
    definition:
      "Sensitivity of derivative price with respect to changes in underlying asset price (∂V/∂S).",
  },
  Vega: {
    term: "Vega (ν)",
    shortName: "Vega",
    definition:
      "Sensitivity of derivative price with respect to changes in implied/asset volatility (∂V/∂σ).",
  },
  "Deflated Sharpe": {
    term: "Deflated Sharpe Ratio",
    shortName: "Deflated Sharpe",
    definition:
      "Adjusts the observed Sharpe ratio downwards to account for selection bias under multiple testing and non-normality.",
  },
};
