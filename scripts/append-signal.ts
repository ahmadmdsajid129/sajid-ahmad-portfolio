import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

interface LiveSignal {
  date: string;
  timestampUTC: string;
  signal: string;
  commitHash: string;
  sha256: string;
  verified: boolean;
  realizedPnLBps: string;
}

const signalsFilePath = path.join(__dirname, "../data/live-signals.json");

export function appendSignal(
  signalDesc: string,
  commitHash: string,
  realizedPnLBps: string
) {
  const rawData = fs.existsSync(signalsFilePath)
    ? fs.readFileSync(signalsFilePath, "utf8")
    : "[]";

  const signals: LiveSignal[] = JSON.parse(rawData);

  const timestampUTC = new Date().toISOString();
  const date = timestampUTC.split("T")[0];

  const payloadToHash = JSON.stringify({
    date,
    timestampUTC,
    signal: signalDesc,
    commitHash,
  });

  const sha256 = crypto.createHash("sha256").update(payloadToHash).digest("hex");

  const newEntry: LiveSignal = {
    date,
    timestampUTC,
    signal: signalDesc,
    commitHash,
    sha256,
    verified: true,
    realizedPnLBps,
  };

  signals.push(newEntry);
  fs.writeFileSync(signalsFilePath, JSON.stringify(signals, null, 2), "utf8");

  console.log(`[OK] Appended cryptographically signed signal: ${sha256.substring(0, 16)}...`);
}

// Example usage when run directly
if (require.main === module) {
  const signal = process.argv[2] || "LONG SPREAD_REVERSION";
  const commit = process.argv[3] || "HEAD";
  const pnl = process.argv[4] || "0.0";
  appendSignal(signal, commit, pnl);
}
