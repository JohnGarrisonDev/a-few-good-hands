import { describe, expect, it } from 'vitest';
import { actionEVs, bestAction, houseEdge } from '../blackjack/ev';
import { evalVP } from '../poker/eval5';
import { eval7, catOf, CAT_FLUSH, CAT_STRAIGHT, CAT_SF, CAT_FULL_HOUSE } from '../poker/eval7';
import { evalDeucesWild } from '../poker/deuces';
import { analyzeHolds } from '../videopoker/ev';
import { JACKS_OR_BETTER, DEUCES_WILD, DOUBLE_DOUBLE_BONUS } from '../videopoker/paytables';
import { threeCardAnalysis, playByBook } from '../threecard/ev';
import { shouldRaisePreflop } from '../uth/strategy';
import { riverAnalysis } from '../uth/ev';
import { settleUTH } from '../uth/rules';

// card helper: rank 0..12 (2..A), suit 0..3 (s,h,d,c)
const c = (rank: number, suit: number) => suit * 13 + rank;
const R = { T: 8, J: 9, Q: 10, K: 11, A: 12 };

describe('blackjack basic strategy', () => {
  const evs = (total: number, soft: boolean, up: number, pair: number | null = null) =>
    actionEVs({ total, soft, pairValue: pair, isTwoCards: true, canSplit: pair !== null }, up);

  it('hits hard 16 vs 10', () => {
    expect(bestAction(evs(16, false, 10))).toBe('hit');
  });
  it('stands hard 16 vs 6', () => {
    expect(bestAction(evs(16, false, 6))).toBe('stand');
  });
  it('doubles 11 vs 6', () => {
    expect(bestAction(evs(11, false, 6))).toBe('double');
  });
  it('doubles 11 vs 10 (S17 infinite deck)', () => {
    expect(bestAction(evs(11, false, 10))).toBe('double');
  });
  it('hits soft 18 vs 9', () => {
    expect(bestAction(evs(18, true, 9))).toBe('hit');
  });
  it('doubles soft 18 vs 6', () => {
    expect(bestAction(evs(18, true, 6))).toBe('double');
  });
  it('stands soft 19 vs 6 (S17)', () => {
    expect(bestAction(evs(19, true, 6))).toBe('stand');
  });
  it('splits 8,8 vs 10', () => {
    expect(bestAction(evs(16, false, 10, 8))).toBe('split');
  });
  it('splits A,A vs 11', () => {
    expect(bestAction(evs(12, true, 11, 11))).toBe('split');
  });
  it('stands on 9,9 vs 7', () => {
    expect(bestAction(evs(18, false, 7, 9))).toBe('stand');
  });
  it('splits 9,9 vs 8', () => {
    expect(bestAction(evs(18, false, 8, 9))).toBe('split');
  });
  it('never splits 10,10 vs 6', () => {
    expect(bestAction(evs(20, false, 6, 10))).toBe('stand');
  });
  it('house edge is a plausible small positive number', () => {
    const e = houseEdge();
    expect(e).toBeGreaterThan(0.002);
    expect(e).toBeLessThan(0.008);
  });
});

describe('5-card evaluator', () => {
  it('royal flush', () => {
    expect(evalVP([c(R.A, 0), c(R.K, 0), c(R.Q, 0), c(R.J, 0), c(R.T, 0)]).cat).toBe('royal-flush');
  });
  it('wheel straight', () => {
    expect(evalVP([c(R.A, 0), c(0, 1), c(1, 2), c(2, 3), c(3, 0)]).cat).toBe('straight');
  });
  it('jacks-or-better vs low pair', () => {
    expect(evalVP([c(R.J, 0), c(R.J, 1), c(2, 2), c(5, 3), c(7, 0)]).cat).toBe('jacks-or-better');
    expect(evalVP([c(8, 0), c(8, 1), c(2, 2), c(5, 3), c(7, 0)]).cat).toBe('low-pair');
  });
  it('quad aces with kicker for DDB', () => {
    const hand = [c(R.A, 0), c(R.A, 1), c(R.A, 2), c(R.A, 3), c(1, 0)]; // AAAA + 3
    expect(DOUBLE_DOUBLE_BONUS.payout(hand).pays).toBe(400);
    const hand2 = [c(R.A, 0), c(R.A, 1), c(R.A, 2), c(R.A, 3), c(R.K, 0)]; // AAAA + K
    expect(DOUBLE_DOUBLE_BONUS.payout(hand2).pays).toBe(160);
  });
});

describe('7-card evaluator', () => {
  it('finds flush over straight', () => {
    const cards = [c(2, 0), c(3, 0), c(4, 0), c(5, 1), c(6, 0), c(7, 2), c(9, 0)];
    expect(catOf(eval7(cards))).toBe(CAT_FLUSH);
  });
  it('finds straight across 7 cards', () => {
    const cards = [c(0, 0), c(1, 1), c(2, 2), c(3, 3), c(4, 0), c(9, 1), c(11, 2)];
    expect(catOf(eval7(cards))).toBe(CAT_STRAIGHT);
  });
  it('straight flush beats quads', () => {
    const sf = eval7([c(2, 0), c(3, 0), c(4, 0), c(5, 0), c(6, 0), c(9, 1), c(9, 2)]);
    const quads = eval7([c(9, 0), c(9, 1), c(9, 2), c(9, 3), c(6, 0), c(2, 1), c(3, 2)]);
    expect(catOf(sf)).toBe(CAT_SF);
    expect(sf).toBeGreaterThan(quads);
  });
  it('full house picks best trips', () => {
    const s = eval7([c(9, 0), c(9, 1), c(9, 2), c(11, 0), c(11, 1), c(11, 2), c(2, 0)]);
    expect(catOf(s)).toBe(CAT_FULL_HOUSE);
  });
});

describe('deuces wild evaluator', () => {
  it('four deuces', () => {
    expect(evalDeucesWild([c(0, 0), c(0, 1), c(0, 2), c(0, 3), c(9, 0)])).toBe('four-deuces');
  });
  it('wild royal', () => {
    expect(evalDeucesWild([c(0, 0), c(R.K, 1), c(R.Q, 1), c(R.J, 1), c(R.T, 1)])).toBe('wild-royal');
  });
  it('natural royal', () => {
    expect(evalDeucesWild([c(R.A, 1), c(R.K, 1), c(R.Q, 1), c(R.J, 1), c(R.T, 1)])).toBe('natural-royal');
  });
  it('five of a kind', () => {
    expect(evalDeucesWild([c(0, 0), c(0, 1), c(7, 0), c(7, 1), c(7, 2)])).toBe('five-kind');
  });
  it('wild straight', () => {
    expect(evalDeucesWild([c(0, 0), c(3, 1), c(4, 2), c(6, 3), c(7, 0)])).toBe('straight');
  });
  it('wild flush', () => {
    expect(evalDeucesWild([c(0, 0), c(3, 1), c(5, 1), c(9, 1), c(11, 1)])).toBe('flush');
  });
  it('lone deuce is three of a kind only with a pair', () => {
    expect(evalDeucesWild([c(0, 0), c(7, 1), c(7, 2), c(4, 3), c(9, 0)])).toBe('three-kind');
    expect(evalDeucesWild([c(0, 0), c(7, 1), c(5, 2), c(3, 3), c(9, 0)])).toBe('nothing');
  });
});

describe('video poker hold analysis', () => {
  it('holds a dealt royal', () => {
    const deal = [c(R.A, 0), c(R.K, 0), c(R.Q, 0), c(R.J, 0), c(R.T, 0)];
    const a = analyzeHolds(deal, JACKS_OR_BETTER);
    expect(a.bestMask).toBe(31);
    expect(a.bestEv).toBe(800);
  });
  it('breaks a flush for 4 to the royal (9/6 JoB)', () => {
    const deal = [c(R.A, 0), c(R.K, 0), c(R.Q, 0), c(R.J, 0), c(7, 0)];
    const a = analyzeHolds(deal, JACKS_OR_BETTER);
    expect(a.bestMask).toBe(0b01111); // hold A K Q J
  });
  it('always holds all four deuces', () => {
    const deal = [c(0, 0), c(0, 1), c(0, 2), c(0, 3), c(9, 0)];
    const a = analyzeHolds(deal, DEUCES_WILD);
    // holding 4 deuces (discard 5th) or all 5 both pay 200; best should include the deuces
    expect((a.bestMask & 0b01111) === 0b01111).toBe(true);
    expect(a.bestEv).toBeGreaterThanOrEqual(200);
  });
});

describe('three card poker', () => {
  it('plays Q-6-4 and folds Q-6-3 (the classic borderline)', () => {
    const q64 = [c(R.Q, 0), c(4, 1), c(2, 2)];
    const q63 = [c(R.Q, 0), c(4, 1), c(1, 2)];
    expect(playByBook(q64)).toBe(true);
    expect(playByBook(q63)).toBe(false);
    const a = threeCardAnalysis(q64);
    const b = threeCardAnalysis(q63);
    expect(a.playEv).toBeGreaterThan(a.foldEv);
    expect(b.playEv).toBeLessThan(b.foldEv);
  });
});

describe('ultimate texas holdem', () => {
  it('preflop chart', () => {
    expect(shouldRaisePreflop(c(R.A, 0), c(0, 1))).toBe(true); // A2o
    expect(shouldRaisePreflop(c(1, 0), c(1, 1))).toBe(true); // 33
    expect(shouldRaisePreflop(c(0, 0), c(0, 1))).toBe(false); // 22
    expect(shouldRaisePreflop(c(R.K, 0), c(0, 0))).toBe(true); // K2s
    expect(shouldRaisePreflop(c(R.K, 0), c(0, 1))).toBe(false); // K2o
    expect(shouldRaisePreflop(c(R.K, 0), c(3, 1))).toBe(true); // K5o
    expect(shouldRaisePreflop(c(R.Q, 0), c(4, 0))).toBe(true); // Q6s
    expect(shouldRaisePreflop(c(R.Q, 0), c(4, 1))).toBe(false); // Q6o
    expect(shouldRaisePreflop(c(R.J, 0), c(6, 0))).toBe(true); // J8s
    expect(shouldRaisePreflop(c(R.J, 0), c(6, 1))).toBe(false); // J8o
    expect(shouldRaisePreflop(c(R.J, 0), c(8, 1))).toBe(true); // JTo
  });

  it('settlement rules', () => {
    // player wins with a flush vs qualified dealer, 4x play: 4 (play) + 1 (ante) + 1.5 (blind)
    const player = CAT_FLUSH * 371293;
    const dealerPair = 1 * 371293;
    expect(settleUTH(player, dealerPair, 4)).toBeCloseTo(6.5);
    // dealer doesn't qualify: ante pushes
    const dealerHigh = 12 * 28561;
    expect(settleUTH(player, dealerHigh, 4)).toBeCloseTo(5.5);
    // loss vs qualified dealer at 1x: -(1+1+1)
    expect(settleUTH(1 * 371293, CAT_FLUSH * 371293, 1)).toBe(-3);
    // fold
    expect(settleUTH(0, 0, 0)).toBe(-2);
  });

  it('river analysis: bets the nuts, folds garbage', () => {
    // player has a royal on board of that suit
    const player = [c(R.A, 0), c(R.K, 0)];
    const board = [c(R.Q, 0), c(R.J, 0), c(R.T, 0), c(3, 1), c(5, 2)];
    const a = riverAnalysis(player, board);
    expect(a.betEv).toBeGreaterThan(a.foldEv);
    expect(a.betEv).toBeGreaterThan(500); // blind pays 500:1 on a royal

    // unpaired garbage where the board doesn't play: K-9-7-5-2 vs 3-4 offsuit
    const p2 = [c(1, 2), c(2, 3)]; // 3,4 offsuit
    const b2 = [c(R.K, 0), c(7, 1), c(5, 2), c(3, 0), c(0, 1)];
    const g = riverAnalysis(p2, b2);
    expect(g.betEv).toBeLessThan(g.foldEv);
  });
});
