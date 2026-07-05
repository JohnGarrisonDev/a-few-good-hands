import { describe, expect, it } from 'vitest';
import { applyAction, deal, gradeAction, handTotal, initialBJState, legalActions } from '../blackjack/game';

function riggedState(playerCards: number[], dealerCards: number[], extraShoe: number[] = []) {
  const s = initialBJState();
  // deal() pops from the end: p1, d1, p2, d2, then hits
  const stack = [...extraShoe].reverse();
  stack.push(dealerCards[1], playerCards[1], dealerCards[0], playerCards[0]);
  // pad the front so the shoe is above the reshuffle threshold
  s.shoe = [...new Array(200).fill(5), ...stack.map((c) => c)].flat() as number[];
  return s;
}

// card helper: rank 0..12 (2..A), suit 0..3
const c = (rank: number, suit: number) => suit * 13 + rank;

describe('blackjack game flow', () => {
  it('splits eights and settles both hands', () => {
    // player 8,8 vs dealer 6 up; after split each hand draws, then we stand both
    let s = riggedState(
      [c(6, 0), c(6, 1)], // two 8s
      [c(4, 0), c(7, 1)], // dealer 6 up, 9 hole
      [c(1, 2), c(0, 3)], // split draws: a 3 and a 2
    );
    s = deal(s, 10);
    expect(s.phase).toBe('player');
    expect(legalActions(s)).toContain('split');

    const grade = gradeAction(s, 'split');
    expect(grade.best).toBe('split');
    expect(grade.correct).toBe(true);

    s = applyAction(s, 'split');
    expect(s.hands.length).toBe(2);
    expect(s.hands[0].cards.length).toBe(2);
    expect(s.hands[1].cards.length).toBe(2);
    expect(s.phase).toBe('player');

    s = applyAction(s, 'stand');
    expect(s.activeHand).toBe(1);
    s = applyAction(s, 'stand');
    expect(s.phase).toBe('settled');
    for (const h of s.hands) {
      expect(h.result).toBeDefined();
      expect(h.payout).toBeDefined();
    }
  });

  it('split aces get exactly one card each', () => {
    let s = riggedState(
      [c(12, 0), c(12, 1)], // A,A
      [c(4, 0), c(7, 1)],
      [c(3, 2), c(8, 3)],
    );
    s = deal(s, 10);
    s = applyAction(s, 'split');
    // both hands complete immediately, dealer plays out
    expect(s.phase).toBe('settled');
    expect(s.hands[0].cards.length).toBe(2);
    expect(s.hands[1].cards.length).toBe(2);
  });

  it('player blackjack pays 3:2 immediately', () => {
    let s = riggedState(
      [c(12, 0), c(8, 1)], // A + 10
      [c(4, 0), c(7, 1)],
    );
    s = deal(s, 20);
    expect(s.phase).toBe('settled');
    expect(s.hands[0].result).toBe('blackjack');
    expect(s.hands[0].payout).toBe(30);
  });

  it('double draws one card and doubles the stake', () => {
    let s = riggedState(
      [c(3, 0), c(4, 1)], // 5+6 = 11
      [c(4, 0), c(3, 1)], // dealer 6 up, 5 hole
      [c(8, 2)], // player draws a ten
    );
    s = deal(s, 10);
    const g = gradeAction(s, 'double');
    expect(g.best).toBe('double');
    s = applyAction(s, 'double');
    expect(s.hands[0].bet).toBe(20);
    expect(s.hands[0].cards.length).toBe(3);
    expect(handTotal(s.hands[0].cards).total).toBe(21);
    expect(s.phase).toBe('settled');
  });
});
