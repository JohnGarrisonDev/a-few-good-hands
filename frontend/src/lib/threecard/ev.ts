import { Card, rankOf, suitOf } from '../cards';

// Three Card Poker (ante + play). Exact EV by enumerating all C(49,3) dealer hands.
// Categories: 5=straight flush, 4=trips, 3=straight, 2=flush, 1=pair, 0=high card.

const P1 = 13, P2 = 169, P3 = 2197;

export function eval3(c1: Card, c2: Card, c3: Card): number {
  const r = [rankOf(c1), rankOf(c2), rankOf(c3)].sort((a, b) => b - a);
  const flush = suitOf(c1) === suitOf(c2) && suitOf(c2) === suitOf(c3);
  const straight =
    (r[0] === r[1] + 1 && r[1] === r[2] + 1) ||
    (r[0] === 12 && r[1] === 1 && r[2] === 0); // A-2-3 (in 3CP, A23 is a straight, second lowest... treat A as low)
  const trips = r[0] === r[2];
  const pair = r[0] === r[1] || r[1] === r[2];

  if (straight && flush) {
    const hi = r[0] === 12 && r[1] === 1 ? 1 : r[0]; // A23 plays as 3-high
    return 5 * P3 + hi * P2;
  }
  if (trips) return 4 * P3 + r[0] * P2;
  if (straight) {
    const hi = r[0] === 12 && r[1] === 1 ? 1 : r[0];
    return 3 * P3 + hi * P2;
  }
  if (flush) return 2 * P3 + r[0] * P2 + r[1] * P1 + r[2];
  if (pair) {
    const pr = r[0] === r[1] ? r[0] : r[1];
    const kicker = r[0] === r[1] ? r[2] : r[0];
    return 1 * P3 + pr * P2 + kicker * P1;
  }
  return r[0] * P2 + r[1] * P1 + r[2];
}

export const cat3 = (score: number): number => Math.floor(score / P3);

/** ante bonus (pays regardless of the dealer): straight 1, trips 4, straight flush 5 */
export function anteBonus(cat: number): number {
  if (cat === 5) return 5;
  if (cat === 4) return 4;
  if (cat === 3) return 1;
  return 0;
}

const QUEEN = 10;

/** dealer qualifies with queen high or better */
export function dealerQualifies3(score: number): boolean {
  if (cat3(score) > 0) return true;
  return Math.floor(score / P2) % 13 >= QUEEN;
}

export interface ThreeCardEV {
  playEv: number; // EV of playing (per ante unit; play bet = 1 ante)
  foldEv: number; // always -1
}

export function threeCardAnalysis(hand: Card[]): ThreeCardEV {
  const playerScore = eval3(hand[0], hand[1], hand[2]);
  const bonus = anteBonus(cat3(playerScore));
  const seen = new Set(hand);
  const stub: Card[] = [];
  for (let c = 0; c < 52; c++) if (!seen.has(c)) stub.push(c);
  const n = stub.length; // 49

  let total = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const ds = eval3(stub[i], stub[j], stub[k]);
        let net: number;
        if (!dealerQualifies3(ds)) {
          net = 1; // ante wins, play pushes
        } else if (playerScore > ds) {
          net = 2;
        } else if (playerScore < ds) {
          net = -2;
        } else {
          net = 0;
        }
        total += net + bonus;
        count++;
      }
    }
  }
  return { playEv: total / count, foldEv: -1 };
}

/** the classic Q-6-4 rule, for showing the "book" answer */
export function playByBook(hand: Card[]): boolean {
  const score = eval3(hand[0], hand[1], hand[2]);
  if (cat3(score) > 0) return true;
  const r = [rankOf(hand[0]), rankOf(hand[1]), rankOf(hand[2])].sort((a, b) => b - a);
  const q64 = [QUEEN, 4, 2]; // Q, 6, 4 as rank indices
  for (let i = 0; i < 3; i++) {
    if (r[i] > q64[i]) return true;
    if (r[i] < q64[i]) return false;
  }
  return true; // exactly Q-6-4 plays
}
