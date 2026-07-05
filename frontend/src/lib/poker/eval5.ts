import { Card, rankOf, suitOf } from '../cards';

// Detailed 5-card evaluation for video poker paytables (no wilds).
// Rank indices: 0=2 ... 8=10, 9=J, 10=Q, 11=K, 12=A.

export interface VPEval {
  /** base category */
  cat:
    | 'royal-flush'
    | 'straight-flush'
    | 'four-kind'
    | 'full-house'
    | 'flush'
    | 'straight'
    | 'three-kind'
    | 'two-pair'
    | 'jacks-or-better'
    | 'low-pair'
    | 'nothing';
  /** rank of quads (for bonus paytables) */
  quadRank?: number;
  /** the 5th card rank when holding quads (kicker, for double double bonus) */
  quadKicker?: number;
}

const JACK = 9;

/** returns true if the 5-bit-per-rank mask contains a 5-long straight; also handles the wheel */
function straightHigh(rankMask: number): number {
  // returns high rank of straight or -1
  for (let hi = 12; hi >= 4; hi--) {
    const need = 0b11111 << (hi - 4);
    if ((rankMask & need) === need) return hi;
  }
  // wheel: A-2-3-4-5
  const wheel = (1 << 12) | 0b1111;
  if ((rankMask & wheel) === wheel) return 3;
  return -1;
}

export function evalVP(hand: Card[]): VPEval {
  const counts = new Array<number>(13).fill(0);
  let rankMask = 0;
  const firstSuit = suitOf(hand[0]);
  let isFlush = true;
  for (const c of hand) {
    const r = rankOf(c);
    counts[r]++;
    rankMask |= 1 << r;
    if (suitOf(c) !== firstSuit) isFlush = false;
  }

  let quad = -1;
  let trips = -1;
  const pairs: number[] = [];
  let single = -1;
  for (let r = 12; r >= 0; r--) {
    if (counts[r] === 4) quad = r;
    else if (counts[r] === 3) trips = r;
    else if (counts[r] === 2) pairs.push(r);
    else if (counts[r] === 1 && single === -1) single = r;
  }

  const stHigh = straightHigh(rankMask);
  const isStraight = stHigh >= 0 && pairs.length === 0 && trips < 0 && quad < 0;

  if (isFlush && isStraight) {
    return stHigh === 12 ? { cat: 'royal-flush' } : { cat: 'straight-flush' };
  }
  if (quad >= 0) {
    // find the kicker (the one rank with count 1)
    let kicker = -1;
    for (let r = 0; r < 13; r++) if (counts[r] === 1) kicker = r;
    return { cat: 'four-kind', quadRank: quad, quadKicker: kicker };
  }
  if (trips >= 0 && pairs.length === 1) return { cat: 'full-house' };
  if (isFlush) return { cat: 'flush' };
  if (isStraight) return { cat: 'straight' };
  if (trips >= 0) return { cat: 'three-kind' };
  if (pairs.length === 2) return { cat: 'two-pair' };
  if (pairs.length === 1) {
    return pairs[0] >= JACK ? { cat: 'jacks-or-better' } : { cat: 'low-pair' };
  }
  return { cat: 'nothing' };
}
