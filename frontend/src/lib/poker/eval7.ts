import { Card } from '../cards';

// Fast 7-card evaluator. Returns a numeric score; higher wins.
// Score layout: category * 13^5 + tiebreak ranks packed base-13 (most significant first).
// Categories: 8=straight flush, 7=quads, 6=full house, 5=flush, 4=straight,
//             3=trips, 2=two pair, 1=pair, 0=high card.

export const CAT_SF = 8;
export const CAT_QUADS = 7;
export const CAT_FULL_HOUSE = 6;
export const CAT_FLUSH = 5;
export const CAT_STRAIGHT = 4;
export const CAT_TRIPS = 3;
export const CAT_TWO_PAIR = 2;
export const CAT_PAIR = 1;
export const CAT_HIGH = 0;

const P1 = 13, P2 = 169, P3 = 2197, P4 = 28561, P5 = 371293;

function straightHighFromMask(mask: number): number {
  for (let hi = 12; hi >= 4; hi--) {
    const need = 0b11111 << (hi - 4);
    if ((mask & need) === need) return hi;
  }
  const wheel = (1 << 12) | 0b1111;
  if ((mask & wheel) === wheel) return 3;
  return -1;
}

export function eval7(cards: Card[] | Int8Array | number[]): number {
  const counts = new Array<number>(13).fill(0);
  const suitCounts = [0, 0, 0, 0];
  const suitMasks = [0, 0, 0, 0];
  let rankMask = 0;
  for (let i = 0; i < 7; i++) {
    const c = cards[i] as number;
    const r = c % 13;
    const s = (c / 13) | 0;
    counts[r]++;
    suitCounts[s]++;
    suitMasks[s] |= 1 << r;
    rankMask |= 1 << r;
  }

  // straight flush / flush
  for (let s = 0; s < 4; s++) {
    if (suitCounts[s] >= 5) {
      const sfHigh = straightHighFromMask(suitMasks[s]);
      if (sfHigh >= 0) return CAT_SF * P5 + sfHigh * P4;
      // flush: top 5 ranks of the suit
      let score = CAT_FLUSH * P5;
      let taken = 0;
      let mult = P4;
      for (let r = 12; r >= 0 && taken < 5; r--) {
        if (suitMasks[s] & (1 << r)) {
          score += r * mult;
          mult /= 13;
          taken++;
        }
      }
      return score;
    }
  }

  let quad = -1, trip1 = -1, trip2 = -1;
  let pair1 = -1, pair2 = -1;
  for (let r = 12; r >= 0; r--) {
    const n = counts[r];
    if (n === 4) quad = r;
    else if (n === 3) {
      if (trip1 < 0) trip1 = r;
      else if (trip2 < 0) trip2 = r;
    } else if (n === 2) {
      if (pair1 < 0) pair1 = r;
      else if (pair2 < 0) pair2 = r;
    }
  }

  if (quad >= 0) {
    let kicker = -1;
    for (let r = 12; r >= 0 && kicker < 0; r--) if (r !== quad && counts[r] > 0) kicker = r;
    return CAT_QUADS * P5 + quad * P4 + kicker * P3;
  }

  if (trip1 >= 0 && (trip2 >= 0 || pair1 >= 0)) {
    const pr = trip2 >= 0 ? trip2 : pair1;
    return CAT_FULL_HOUSE * P5 + trip1 * P4 + pr * P3;
  }

  const stHigh = straightHighFromMask(rankMask);
  if (stHigh >= 0) return CAT_STRAIGHT * P5 + stHigh * P4;

  if (trip1 >= 0) {
    let score = CAT_TRIPS * P5 + trip1 * P4;
    let taken = 0;
    let mult = P3;
    for (let r = 12; r >= 0 && taken < 2; r--) {
      if (r !== trip1 && counts[r] > 0) {
        score += r * mult;
        mult /= 13;
        taken++;
      }
    }
    return score;
  }

  if (pair1 >= 0 && pair2 >= 0) {
    let kicker = -1;
    for (let r = 12; r >= 0 && kicker < 0; r--) {
      if (r !== pair1 && r !== pair2 && counts[r] > 0) kicker = r;
    }
    return CAT_TWO_PAIR * P5 + pair1 * P4 + pair2 * P3 + kicker * P2;
  }

  if (pair1 >= 0) {
    let score = CAT_PAIR * P5 + pair1 * P4;
    let taken = 0;
    let mult = P3;
    for (let r = 12; r >= 0 && taken < 3; r--) {
      if (r !== pair1 && counts[r] > 0) {
        score += r * mult;
        mult /= 13;
        taken++;
      }
    }
    return score;
  }

  let score = CAT_HIGH * P5;
  let taken = 0;
  let mult = P4;
  for (let r = 12; r >= 0 && taken < 5; r--) {
    if (counts[r] > 0) {
      score += r * mult;
      mult /= 13;
      taken++;
    }
  }
  return score;
}

/** category of a 7-card hand score */
export const catOf = (score: number): number => Math.floor(score / P5);
