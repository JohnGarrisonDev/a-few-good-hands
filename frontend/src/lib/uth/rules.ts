import { CAT_PAIR, CAT_STRAIGHT, CAT_FLUSH, CAT_FULL_HOUSE, CAT_QUADS, CAT_SF, catOf } from '../poker/eval7';

// Ultimate Texas Hold'em settlement, per 1 unit of ante (blind = 1 unit as well).
// playMult: 4 (preflop), 2 (flop), 1 (river), or 0 = fold.

/** blind bet pay multiplier for a winning player hand category (pays only on straight or better) */
export function blindPays(cat: number, isRoyal: boolean): number {
  if (cat === CAT_SF) return isRoyal ? 500 : 50;
  if (cat === CAT_QUADS) return 10;
  if (cat === CAT_FULL_HOUSE) return 3;
  if (cat === CAT_FLUSH) return 1.5;
  if (cat === CAT_STRAIGHT) return 1;
  return 0;
}

const ROYAL_SCORE_MIN = CAT_SF * 371293 + 12 * 28561; // straight flush, ace high

/** net result in ante units. playMult 0 = fold (lose ante + blind). */
export function settleUTH(playerScore: number, dealerScore: number, playMult: number): number {
  if (playMult === 0) return -2;
  const dealerQualifies = catOf(dealerScore) >= CAT_PAIR;
  if (playerScore > dealerScore) {
    const cat = catOf(playerScore);
    const isRoyal = playerScore >= ROYAL_SCORE_MIN;
    let net = playMult; // play bet pays 1:1
    net += dealerQualifies ? 1 : 0; // ante pays 1:1 only if dealer qualifies
    net += blindPays(cat, isRoyal); // blind pays on straight+ else pushes
    return net;
  }
  if (playerScore < dealerScore) {
    let net = -playMult - 1; // play + blind lost
    net += dealerQualifies ? -1 : 0; // ante pushes if dealer doesn't qualify
    return net;
  }
  return 0; // tie: everything pushes
}
