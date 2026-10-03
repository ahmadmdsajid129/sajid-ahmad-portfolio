export interface TickerItem {
  label: string;
  value: string;
  change?: string;
  type?: "up" | "down" | "neutral" | "accent";
}

export const tickerItems: TickerItem[] = [
  { label: "PRJ", value: "5", type: "accent" },
  { label: "TESTS PASSING", value: "61/61", change: "▲", type: "up" },
  { label: "FRAUD PR-AUC", value: "0.9825", type: "up" },
  { label: "OOS ACC (LOB)", value: "~67%", type: "accent" },
  { label: "MC PATHS", value: "100,000", type: "neutral" },
  { label: "BS vs MC ERR", value: "0.0068", type: "up" },
  { label: "FRAUD p95", value: "92.24ms", type: "accent" },
  { label: "STATUS", value: "OPEN TO ROLES", type: "up" },
  { label: "MATCHING ENGINE", value: "O(1) QUEUES", type: "neutral" },
  { label: "VARIANCE REDUCTION", value: "ANTITHETIC+CV", type: "up" },
];
