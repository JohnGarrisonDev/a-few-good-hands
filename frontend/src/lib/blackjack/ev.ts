// Blackjack expected-value engine (infinite-deck model).
// Rules: dealer stands on all 17s (S17), blackjack pays 3:2, double on any two cards,
// double after split allowed, one split (no resplit), split aces get one card, no surrender,
// dealer peeks for blackjack (player loses only the original bet to a dealer BJ).
//
// EVs are per unit of the initial bet. All post-deal EVs are conditioned on the dealer
// NOT having blackjack (the peek has already happened), matching how decisions are made in play.

export type BJAction = 'hit' | 'stand' | 'double' | 'split';

// value classes 2..11 with infinite-deck probabilities (ten-class has 4/13)
const CARD_VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const cardProb = (v: number) => (v === 10 ? 4 / 13 : 1 / 13);

interface DealerDist {
  // probability dealer ends on 17,18,19,20,21 (index 0..4) or busts (index 5)
  p: number[];
}

const dealerCache = new Map<string, number[]>();

/** distribution of dealer final totals starting from (total, soft), S17 */
function dealerPlay(total: number, soft: boolean): number[] {
  if (total > 21) {
    if (soft) return dealerPlay(total - 10, false);
    return [0, 0, 0, 0, 0, 1];
  }
  if (total >= 17) {
    const out = [0, 0, 0, 0, 0, 0];
    out[total - 17] = 1;
    return out;
  }
  const key = `${total},${soft ? 1 : 0}`;
  const hit = dealerCache.get(key);
  if (hit) return hit;
  const out = [0, 0, 0, 0, 0, 0];
  for (const v of CARD_VALUES) {
    const p = cardProb(v);
    let nt = total + v;
    let ns = soft;
    if (v === 11) {
      if (nt > 21) nt -= 10;
      else ns = true;
    }
    if (nt > 21 && ns) {
      nt -= 10;
      ns = false;
    }
    const sub = dealerPlay(nt, ns);
    for (let i = 0; i < 6; i++) out[i] += p * sub[i];
  }
  dealerCache.set(key, out);
  return out;
}

const upDistCache = new Map<number, DealerDist>();

/** dealer final distribution given upcard value, conditioned on no dealer blackjack */
export function dealerDistribution(up: number): DealerDist {
  const cached = upDistCache.get(up);
  if (cached) return cached;
  const out = [0, 0, 0, 0, 0, 0];
  let totalP = 0;
  for (const v of CARD_VALUES) {
    let p = cardProb(v);
    // condition on no blackjack: exclude the hole card that would complete a natural
    if (up === 11 && v === 10) continue;
    if (up === 10 && v === 11) continue;
    totalP += p;
    let t = up + v;
    let soft = up === 11 || v === 11;
    if (t > 21) t -= 10; // A+A = 12
    const sub = dealerPlay(t, soft);
    for (let i = 0; i < 6; i++) out[i] += p * sub[i];
  }
  for (let i = 0; i < 6; i++) out[i] /= totalP;
  const dist = { p: out };
  upDistCache.set(up, dist);
  return dist;
}

/** probability dealer has blackjack given the upcard (before peek resolution) */
export function dealerBJProb(up: number): number {
  if (up === 11) return 4 / 13;
  if (up === 10) return 1 / 13;
  return 0;
}

function evStandRaw(total: number, up: number): number {
  if (total > 21) return -1;
  const d = dealerDistribution(up).p;
  let ev = 0;
  for (let i = 0; i < 5; i++) {
    const dt = 17 + i;
    if (total > dt) ev += d[i];
    else if (total < dt) ev -= d[i];
  }
  ev += d[5]; // dealer bust
  return ev;
}

const standCache = new Map<string, number>();
export function evStand(total: number, up: number): number {
  const key = `${total},${up}`;
  let v = standCache.get(key);
  if (v === undefined) {
    v = evStandRaw(total, up);
    standCache.set(key, v);
  }
  return v;
}

const hitCache = new Map<string, number>();
/** EV of hitting then continuing optimally (hit/stand only) */
export function evHit(total: number, soft: boolean, up: number): number {
  const key = `${total},${soft ? 1 : 0},${up}`;
  const cached = hitCache.get(key);
  if (cached !== undefined) return cached;
  let ev = 0;
  for (const v of CARD_VALUES) {
    const p = cardProb(v);
    let nt = total + v;
    let ns = soft;
    if (v === 11) {
      if (nt > 21) nt -= 10;
      else ns = true;
    }
    if (nt > 21 && ns) {
      nt -= 10;
      ns = false;
    }
    if (nt > 21) {
      ev -= p;
    } else {
      ev += p * Math.max(evStand(nt, up), evHit(nt, ns, up));
    }
  }
  hitCache.set(key, ev);
  return ev;
}

/** EV of doubling: one card, bet doubled */
export function evDouble(total: number, soft: boolean, up: number): number {
  let ev = 0;
  for (const v of CARD_VALUES) {
    const p = cardProb(v);
    let nt = total + v;
    let ns = soft;
    if (v === 11) {
      if (nt > 21) nt -= 10;
      else ns = true;
    }
    if (nt > 21 && ns) {
      nt -= 10;
      ns = false;
    }
    ev += p * 2 * (nt > 21 ? -1 : evStand(nt, up));
  }
  return ev;
}

/** EV of one split hand (per unit bet on that hand). pairValue is the value of one split card. */
function evSplitHand(pairValue: number, up: number): number {
  let ev = 0;
  for (const v of CARD_VALUES) {
    const p = cardProb(v);
    let total = pairValue + v;
    let soft = pairValue === 11 || v === 11;
    if (total > 21) total -= 10;
    if (pairValue === 11) {
      // split aces: one card only
      ev += p * evStand(total, up);
    } else {
      // play optimally; double after split allowed
      ev += p * Math.max(evStand(total, up), evHit(total, soft, up), evDouble(total, soft, up));
    }
  }
  return ev;
}

const splitCache = new Map<string, number>();
/** EV of splitting a pair (per unit of the ORIGINAL bet; total risk is 2 units) */
export function evSplit(pairValue: number, up: number): number {
  const key = `${pairValue},${up}`;
  let v = splitCache.get(key);
  if (v === undefined) {
    v = 2 * evSplitHand(pairValue, up);
    splitCache.set(key, v);
  }
  return v;
}

export interface HandState {
  total: number;
  soft: boolean;
  /** value of the paired card if the hand is a splittable pair, else null */
  pairValue: number | null;
  isTwoCards: boolean;
  canSplit: boolean; // pair AND splitting still allowed this round
}

export type ActionEVs = Partial<Record<BJAction, number>>;

/** EVs for every legal action in this state (per unit of initial bet) */
export function actionEVs(state: HandState, up: number): ActionEVs {
  const evs: ActionEVs = {
    stand: evStand(state.total, up),
    hit: evHit(state.total, state.soft, up),
  };
  if (state.isTwoCards) evs.double = evDouble(state.total, state.soft, up);
  if (state.canSplit && state.pairValue !== null) evs.split = evSplit(state.pairValue, up);
  return evs;
}

export function bestAction(evs: ActionEVs): BJAction {
  let best: BJAction = 'stand';
  let bestEv = -Infinity;
  for (const [a, ev] of Object.entries(evs) as [BJAction, number][]) {
    if (ev > bestEv) {
      bestEv = ev;
      best = a;
    }
  }
  return best;
}

/**
 * Overall house edge under perfect play (positive = house advantage),
 * as a fraction of the initial bet. Computed once from this same EV model.
 */
let cachedEdge: number | null = null;
export function houseEdge(): number {
  if (cachedEdge !== null) return cachedEdge;
  let ev = 0;
  for (const up of CARD_VALUES) {
    const pUp = cardProb(up);
    const pBJ = dealerBJProb(up);
    for (const c1 of CARD_VALUES) {
      for (const c2 of CARD_VALUES) {
        const p = cardProb(c1) * cardProb(c2);
        const playerBJ = (c1 === 11 && c2 === 10) || (c1 === 10 && c2 === 11);
        let total = c1 + c2;
        let soft = c1 === 11 || c2 === 11;
        if (total > 21) {
          total -= 10; // A+A
        }
        let handEv: number;
        if (playerBJ) {
          // push vs dealer BJ, else 3:2
          handEv = pBJ * 0 + (1 - pBJ) * 1.5;
        } else {
          const state: HandState = {
            total,
            soft,
            pairValue: c1 === c2 ? c1 : null,
            isTwoCards: true,
            canSplit: c1 === c2,
          };
          const evs = actionEVs(state, up);
          const best = Math.max(...(Object.values(evs) as number[]));
          handEv = pBJ * -1 + (1 - pBJ) * best;
        }
        ev += pUp * p * handEv;
      }
    }
  }
  cachedEdge = -ev;
  return cachedEdge;
}
