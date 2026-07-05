import { Card, rankOf, suitOf } from '../cards';

// Deuces Wild 5-card evaluator. Deuces (rank index 0) are wild.

export type DWCat =
  | 'natural-royal'
  | 'four-deuces'
  | 'wild-royal'
  | 'five-kind'
  | 'straight-flush'
  | 'four-kind'
  | 'full-house'
  | 'flush'
  | 'straight'
  | 'three-kind'
  | 'nothing';

/**
 * Can the non-wild ranks (mask over ranks 1..12, i.e. 3..A) plus `wilds` wild cards
 * form a 5-card straight? Returns highest achievable straight high rank, or -1.
 */
function wildStraightHigh(rankMask: number, wilds: number, naturals: number): number {
  // try every straight window from high=12 (A) down to high=4 (7-high: 3,4,5,6,7)
  // ranks here are indices where 0 would be a deuce (wild), so lowest natural is 1 (=3).
  for (let hi = 12; hi >= 4; hi--) {
    let missing = 0;
    for (let r = hi - 4; r <= hi; r++) {
      if (r === 0) {
        missing++; // a natural 2 can't be used (it's wild), wild must fill
        continue;
      }
      if (!(rankMask & (1 << r))) missing++;
    }
    if (missing <= wilds) return hi;
  }
  // A-3-4-5 + wild for the "2" slot, i.e. wheel A2345 needs ace + 3,4,5 with wild as 2
  {
    let missing = 1; // the 2-slot always needs a wild
    for (const r of [12, 1, 2, 3]) {
      if (!(rankMask & (1 << r))) missing++;
    }
    if (missing <= wilds) return 3;
  }
  return -1;
}

export function evalDeucesWild(hand: Card[]): DWCat {
  let wilds = 0;
  const naturalCards: Card[] = [];
  for (const c of hand) {
    if (rankOf(c) === 0) wilds++;
    else naturalCards.push(c);
  }
  if (wilds === 4) return 'four-deuces';

  const counts = new Array<number>(13).fill(0);
  let rankMask = 0;
  const suitMasks = [0, 0, 0, 0];
  for (const c of naturalCards) {
    const r = rankOf(c);
    counts[r]++;
    rankMask |= 1 << r;
    suitMasks[suitOf(c)] |= 1 << r;
  }

  const distinctRanks = naturalCards.length === 0 ? 0 : countBits(rankMask);
  let maxCount = 0;
  for (let r = 1; r < 13; r++) maxCount = Math.max(maxCount, counts[r]);

  // natural royal (no wilds)
  if (wilds === 0) {
    const royalMask = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8); // A K Q J T
    for (let s = 0; s < 4; s++) {
      if (suitMasks[s] === royalMask && countBits(suitMasks[s]) === 5 && naturalCards.length === 5) {
        // all 5 in same suit and exactly royal ranks
        let sameSuit = naturalCards.every((c) => suitOf(c) === suitOf(naturalCards[0]));
        if (sameSuit) return 'natural-royal';
      }
    }
  }

  // wild royal: all naturals are T+ (rank >= 8), same suit, distinct
  {
    const allHigh = naturalCards.every((c) => rankOf(c) >= 8);
    const sameSuit = naturalCards.length > 0 && naturalCards.every((c) => suitOf(c) === suitOf(naturalCards[0]));
    const distinct = distinctRanks === naturalCards.length;
    if (wilds > 0 && allHigh && sameSuit && distinct) return 'wild-royal';
  }

  // five of a kind
  if (maxCount + wilds >= 5) return 'five-kind';

  // straight flush: within one suit, naturals distinct in that suit + wilds fill a window
  {
    const sameSuit = naturalCards.length > 0 && naturalCards.every((c) => suitOf(c) === suitOf(naturalCards[0]));
    if (sameSuit && distinctRanks === naturalCards.length) {
      const s = suitOf(naturalCards[0]);
      if (wildStraightHigh(suitMasks[s], wilds, naturalCards.length) >= 0) return 'straight-flush';
    }
  }

  if (maxCount + wilds >= 4) return 'four-kind';

  // full house: (pair + pair + wild) or (trips + pair) arrangements
  {
    let pairs = 0, tripsN = 0;
    for (let r = 1; r < 13; r++) {
      if (counts[r] === 2) pairs++;
      if (counts[r] === 3) tripsN++;
    }
    if ((tripsN === 1 && pairs === 1) || (pairs === 2 && wilds >= 1)) return 'full-house';
  }

  // flush
  {
    const sameSuit = naturalCards.length > 0 && naturalCards.every((c) => suitOf(c) === suitOf(naturalCards[0]));
    if (sameSuit) return 'flush';
  }

  // straight
  if (distinctRanks === naturalCards.length && wildStraightHigh(rankMask, wilds, naturalCards.length) >= 0) {
    return 'straight';
  }

  if (maxCount + wilds >= 3) return 'three-kind';

  return 'nothing';
}

function countBits(n: number): number {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
}
