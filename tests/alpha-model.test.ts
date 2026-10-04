import { describe, it, expect } from "vitest";
import { predictAlpha, ALPHA_MODEL_DATA } from "../lib/lob-alpha-model";

describe("XGBoost Limit Order Book Alpha Model", () => {
  it("loads 30 trained decision trees with valid metadata", () => {
    expect(ALPHA_MODEL_DATA.trees).toHaveLength(30);
    expect(ALPHA_MODEL_DATA.metadata.features).toEqual([
      "spread",
      "imbalance",
      "micro_mid_diff",
      "depth_imbalance",
      "vwap_deviation",
    ]);
    expect(ALPHA_MODEL_DATA.metadata.metrics.accuracy).toBeGreaterThan(0.60);
  });

  it("predicts LONG signal when order book imbalance and depth indicate buy pressure", () => {
    const result = predictAlpha({
      spread: 0.10,
      imbalance: 0.85, // strong buy volume at L1
      micro_mid_diff: 0.04, // micro-price pulled upward toward ask
      depth_imbalance: 0.75, // multi-level buy depth
      vwap_deviation: -0.03, // mid is below VWAP
    });

    expect(result.probUp).toBeGreaterThan(0.55);
    expect(result.signal).toBe("LONG");
    expect(result.confidence).toBeGreaterThanOrEqual(55);
  });

  it("predicts SHORT signal when order book imbalance and depth indicate sell pressure", () => {
    const result = predictAlpha({
      spread: 0.10,
      imbalance: -0.85, // strong sell volume at L1
      micro_mid_diff: -0.04, // micro-price pulled downward toward bid
      depth_imbalance: -0.75, // multi-level sell depth
      vwap_deviation: 0.03, // mid is above VWAP
    });

    expect(result.probUp).toBeLessThan(0.45);
    expect(result.signal).toBe("SHORT");
    expect(result.confidence).toBeGreaterThanOrEqual(55);
  });

  it("predicts balanced probability near 0.50 on completely neutral order book", () => {
    const result = predictAlpha({
      spread: 0.10,
      imbalance: 0.0,
      micro_mid_diff: 0.0,
      depth_imbalance: 0.0,
      vwap_deviation: 0.0,
    });

    expect(result.probUp).toBeGreaterThanOrEqual(0.30);
    expect(result.probUp).toBeLessThanOrEqual(0.70);
  });
});
