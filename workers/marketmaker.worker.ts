// Market Maker Web Worker: Simulates continuous adverse selection dynamics
// where quotes are filled based on visitor's half-spread and inventory skew settings.

interface MMConfig {
  halfSpread: number; // e.g. 0.05 to 0.50
  inventorySkew: number; // e.g. -1.0 to 1.0 (Avellaneda-Stoikov style bias)
}

let running = false;
let config: MMConfig = { halfSpread: 0.1, inventorySkew: 0.0 };

let cash = 0;
let inventory = 0;
let midPrice = 100.0;
let tradesCount = 0;
let adverseSelectionCount = 0;
let tickTimer: any = null;

function stepMM() {
  if (!running) return;

  // 1. Mean-reverting drift + random shock for mid price
  const dt = 0.2;
  const drift = 0.05 * (100.0 - midPrice) * dt;
  const shock = (Math.random() - 0.5) * 0.35;
  midPrice = parseFloat((midPrice + drift + shock).toFixed(3));

  // 2. User's quoted prices with inventory skew adjustment:
  // r(s, q) = s - q * gamma * sigma^2 (skew lowers quotes if inventory is positive, to shed stock)
  const skewAdjustment = config.inventorySkew * (inventory * 0.02);
  const myBid = parseFloat((midPrice - config.halfSpread - skewAdjustment).toFixed(2));
  const myAsk = parseFloat((midPrice + config.halfSpread - skewAdjustment).toFixed(2));

  // 3. Order flow arrives: Poisson probability of order arrival inversely proportional to half-spread
  // Thighter spread = higher arrival intensity
  const baseArrivalProb = Math.max(0.1, Math.min(0.85, 0.08 / Math.max(0.02, config.halfSpread)));

  // Informed trader arrival (creates adverse selection)
  // Informed traders hit our bid right before a down-move, or hit our ask right before an up-move
  const informedMove = Math.random() < 0.28;

  let filledSide: "none" | "buy" | "sell" = "none";

  if (informedMove) {
    // Adverse selection scenario: informed order hits quote, price jumps immediately against MM
    if (Math.random() > 0.5) {
      // Informed Sell hits MM's bid
      inventory += 1;
      cash -= myBid;
      tradesCount += 1;
      adverseSelectionCount += 1;
      filledSide = "buy";
      midPrice -= 0.15; // Price drops immediately after fill!
    } else {
      // Informed Buy hits MM's ask
      inventory -= 1;
      cash += myAsk;
      tradesCount += 1;
      adverseSelectionCount += 1;
      filledSide = "sell";
      midPrice += 0.15; // Price rises immediately after fill!
    }
  } else if (Math.random() < baseArrivalProb) {
    // Uninformed (noise) order arrival
    if (Math.random() > 0.5) {
      // Fill at Bid (we buy)
      inventory += 1;
      cash -= myBid;
      tradesCount += 1;
      filledSide = "buy";
    } else {
      // Fill at Ask (we sell)
      inventory -= 1;
      cash += myAsk;
      tradesCount += 1;
      filledSide = "sell";
    }
  }

  // Calculate Mark-to-Market P&L: Cash + Inventory * MidPrice
  const mtmPnL = parseFloat((cash + inventory * midPrice).toFixed(2));

  self.postMessage({
    type: "MM_STATE",
    payload: {
      midPrice,
      myBid,
      myAsk,
      inventory,
      cash: parseFloat(cash.toFixed(2)),
      pnl: mtmPnL,
      tradesCount,
      adverseSelectionCount,
      lastFill: filledSide,
      timestamp: Date.now(),
    },
  });
}

self.onmessage = (e: MessageEvent) => {
  const { action, payload } = e.data;
  if (action === "START") {
    running = true;
    if (!tickTimer) {
      tickTimer = setInterval(stepMM, 300);
    }
  } else if (action === "STOP") {
    running = false;
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  } else if (action === "UPDATE_CONFIG") {
    if (payload) {
      config = { ...config, ...payload };
    }
  } else if (action === "RESET") {
    cash = 0;
    inventory = 0;
    midPrice = 100.0;
    tradesCount = 0;
    adverseSelectionCount = 0;
    self.postMessage({
      type: "MM_STATE",
      payload: {
        midPrice: 100.0,
        myBid: 99.9,
        myAsk: 100.1,
        inventory: 0,
        cash: 0,
        pnl: 0,
        tradesCount: 0,
        adverseSelectionCount: 0,
        lastFill: "none",
        timestamp: Date.now(),
      },
    });
  }
};
