// Order Book Web Worker: Simulates continuous limit order book dynamics with FIFO queues,
// mean-reverting price walk, OBI (Order Book Imbalance), and volume-weighted micro-price.

export interface PriceLevel {
  price: number;
  size: number;
  total: number; // cumulative depth
  ordersCount: number;
}

export interface BookSnapshot {
  bids: PriceLevel[];
  asks: PriceLevel[];
  mid: number;
  spread: number;
  obi: number; // Order book imbalance [-1, 1]
  microPrice: number;
  history: number[]; // Last 120 mid prices
  timestamp: number;
  lastEvent: string;
}

// Initial fair price
let fairValue = 100.0;
const tickSize = 0.05;
const levelsCount = 10;
const historyMax = 120;
const midHistory: number[] = [];

// Initialize history
for (let i = 0; i < historyMax; i++) {
  midHistory.push(100.0);
}

// Mean-reversion parameters
const meanPrice = 100.0;
const meanReversionSpeed = 0.08;
const volatility = 0.12;

// Internal queue state per level (FIFO queues of order sizes)
interface LevelQueue {
  price: number;
  orders: number[]; // order sizes in queue
}

let bidQueues: LevelQueue[] = [];
let askQueues: LevelQueue[] = [];

function initBook() {
  bidQueues = [];
  askQueues = [];

  const bestBid = Math.floor(fairValue / tickSize) * tickSize - tickSize / 2;
  const bestAsk = bestBid + tickSize;

  for (let i = 0; i < levelsCount; i++) {
    const pBid = parseFloat((bestBid - i * tickSize).toFixed(2));
    const pAsk = parseFloat((bestAsk + i * tickSize).toFixed(2));

    const bidOrders = [
      Math.floor(Math.random() * 20 + 10),
      Math.floor(Math.random() * 25 + 10),
      Math.floor(Math.random() * 30 + 10),
    ];
    const askOrders = [
      Math.floor(Math.random() * 20 + 10),
      Math.floor(Math.random() * 25 + 10),
      Math.floor(Math.random() * 30 + 10),
    ];

    bidQueues.push({ price: pBid, orders: bidOrders });
    askQueues.push({ price: pAsk, orders: askOrders });
  }
}

initBook();

function getSnapshot(lastEvent: string = "ORDER_FLOW"): BookSnapshot {
  // Aggregate bids
  let bidTotal = 0;
  const bids: PriceLevel[] = bidQueues.map((lvl) => {
    const size = lvl.orders.reduce((a, b) => a + b, 0);
    bidTotal += size;
    return {
      price: lvl.price,
      size,
      total: bidTotal,
      ordersCount: lvl.orders.length,
    };
  });

  // Aggregate asks
  let askTotal = 0;
  const asks: PriceLevel[] = askQueues.map((lvl) => {
    const size = lvl.orders.reduce((a, b) => a + b, 0);
    askTotal += size;
    return {
      price: lvl.price,
      size,
      total: askTotal,
      ordersCount: lvl.orders.length,
    };
  });

  const bestBid = bids[0]?.price || fairValue - tickSize;
  const bestAsk = asks[0]?.price || fairValue + tickSize;
  const mid = parseFloat(((bestBid + bestAsk) / 2).toFixed(3));
  const spread = parseFloat((bestAsk - bestBid).toFixed(2));

  // Compute Order Book Imbalance (OBI) at top of book
  const vBid = bids[0]?.size || 1;
  const vAsk = asks[0]?.size || 1;
  const obi = parseFloat(((vBid - vAsk) / (vBid + vAsk)).toFixed(4));

  // Compute Volume-weighted micro-price: (P_ask * V_bid + P_bid * V_ask) / (V_bid + V_ask)
  const microPrice = parseFloat(
    ((bestAsk * vBid + bestBid * vAsk) / (vBid + vAsk)).toFixed(3)
  );

  midHistory.push(mid);
  if (midHistory.length > historyMax) {
    midHistory.shift();
  }

  return {
    bids,
    asks,
    mid,
    spread,
    obi,
    microPrice,
    history: [...midHistory],
    timestamp: Date.now(),
    lastEvent,
  };
}

let intervalId: any = null;

function stepSimulation() {
  // 1. Mean-reverting random walk for underlying fair value
  const dt = 0.25;
  const drift = meanReversionSpeed * (meanPrice - fairValue) * dt;
  // Box-Muller transform for standard normal random variable
  const u1 = Math.max(1e-9, Math.random());
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const shock = volatility * Math.sqrt(dt) * z;

  fairValue += drift + shock;

  // Occasional burst imbalance
  const burstEvent = Math.random() < 0.15;
  let eventType = "BOOK_TICK";

  if (burstEvent) {
    eventType = Math.random() > 0.5 ? "BUY_BURST" : "SELL_BURST";
    if (eventType === "BUY_BURST") {
      // Aggressive market buy: consumes top of ask queue
      if (askQueues[0] && askQueues[0].orders.length > 0) {
        askQueues[0].orders.shift();
        if (askQueues[0].orders.length === 0) {
          // Level cleared, shift ask queues up
          askQueues.shift();
          const lastAsk = askQueues[askQueues.length - 1]?.price || fairValue + tickSize;
          askQueues.push({
            price: parseFloat((lastAsk + tickSize).toFixed(2)),
            orders: [Math.floor(Math.random() * 30 + 15)],
          });
        }
      }
      fairValue += tickSize * 0.4;
    } else {
      // Aggressive market sell: consumes top of bid queue
      if (bidQueues[0] && bidQueues[0].orders.length > 0) {
        bidQueues[0].orders.shift();
        if (bidQueues[0].orders.length === 0) {
          // Level cleared, shift bid queues down
          bidQueues.shift();
          const lastBid = bidQueues[bidQueues.length - 1]?.price || fairValue - tickSize;
          bidQueues.push({
            price: parseFloat((lastBid - tickSize).toFixed(2)),
            orders: [Math.floor(Math.random() * 30 + 15)],
          });
        }
      }
      fairValue -= tickSize * 0.4;
    }
  } else {
    // Normal passive liquidity provision and cancellation
    const side = Math.random() > 0.5 ? "bid" : "ask";
    const queue = side === "bid" ? bidQueues : askQueues;
    const levelIdx = Math.floor(Math.random() * Math.min(4, queue.length));

    if (queue[levelIdx]) {
      if (Math.random() > 0.4) {
        // Add limit order to back of FIFO queue
        const newOrder = Math.floor(Math.random() * 25 + 5);
        queue[levelIdx].orders.push(newOrder);
      } else if (queue[levelIdx].orders.length > 1) {
        // Cancel order from queue
        queue[levelIdx].orders.pop();
      }
    }
  }

  // Ensure spread is maintained and valid
  const currentBestBid = bidQueues[0]?.price;
  const currentBestAsk = askQueues[0]?.price;
  if (!currentBestBid || !currentBestAsk || currentBestBid >= currentBestAsk) {
    initBook();
  }

  const snapshot = getSnapshot(eventType);
  self.postMessage({ type: "BOOK_UPDATE", payload: snapshot });
}

self.onmessage = (e: MessageEvent) => {
  const { action } = e.data;
  if (action === "START") {
    if (!intervalId) {
      intervalId = setInterval(stepSimulation, 250);
    }
  } else if (action === "STOP") {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  } else if (action === "RESET") {
    fairValue = 100.0;
    initBook();
    self.postMessage({ type: "BOOK_UPDATE", payload: getSnapshot("RESET") });
  }
};

// Send initial frame
self.postMessage({ type: "BOOK_UPDATE", payload: getSnapshot("INITIAL") });
