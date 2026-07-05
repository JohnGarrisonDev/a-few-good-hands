import { Card } from '../cards';
import { Paytable } from './paytables';

// Exact hold-EV computation: for each of the 32 hold masks, enumerate every
// possible draw from the 47 unseen cards and average the payout.

export interface HoldAnalysis {
  /** EV (expected payout per unit bet) for each hold mask 0..31; bit i = hold dealt card i */
  evs: number[];
  bestMask: number;
  bestEv: number;
}

export function analyzeHolds(deal: Card[], paytable: Paytable): HoldAnalysis {
  const dealt = new Set(deal);
  const stub: Card[] = [];
  for (let c = 0; c < 52; c++) if (!dealt.has(c)) stub.push(c);

  const evs = new Array<number>(32).fill(0);
  const hand = new Array<number>(5);

  for (let mask = 0; mask < 32; mask++) {
    const held: Card[] = [];
    for (let i = 0; i < 5; i++) if (mask & (1 << i)) held.push(deal[i]);
    const need = 5 - held.length;
    for (let i = 0; i < held.length; i++) hand[i] = held[i];

    let total = 0;
    let count = 0;

    // enumerate combinations of `need` cards from stub
    const idx = new Array<number>(need);
    const n = stub.length;
    const rec = (start: number, depth: number) => {
      if (depth === need) {
        for (let i = 0; i < need; i++) hand[held.length + i] = stub[idx[i]];
        total += paytable.payout(hand).pays;
        count++;
        return;
      }
      for (let i = start; i <= n - (need - depth); i++) {
        idx[depth] = i;
        rec(i + 1, depth + 1);
      }
    };
    if (need === 0) {
      total = paytable.payout(hand.slice(0, 5) as Card[]).pays;
      count = 1;
    } else {
      rec(0, 0);
    }
    evs[mask] = total / count;
  }

  let bestMask = 0;
  let bestEv = -1;
  for (let mask = 0; mask < 32; mask++) {
    if (evs[mask] > bestEv + 1e-12) {
      bestEv = evs[mask];
      bestMask = mask;
    }
  }
  return { evs, bestMask, bestEv };
}
