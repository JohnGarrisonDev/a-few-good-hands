import { Card, bjValue, freshDeck, shuffle, rankOf } from '../cards';
import { ActionEVs, BJAction, HandState, actionEVs, bestAction } from './ev';

export interface BJHand {
  cards: Card[];
  bet: number;
  doubled: boolean;
  stood: boolean;
  busted: boolean;
  fromSplit: boolean;
  splitAcesDone: boolean;
  result?: 'win' | 'lose' | 'push' | 'blackjack';
  payout?: number; // net win/loss for this hand (excluding returned stake bookkeeping: net delta to bankroll)
}

export type BJPhase = 'betting' | 'player' | 'dealer' | 'settled';

export interface BJGameState {
  shoe: Card[];
  discards: number;
  dealerCards: Card[]; // [up, hole, ...]
  hands: BJHand[];
  activeHand: number;
  phase: BJPhase;
  dealerRevealed: boolean;
  message: string | null;
}

export const NUM_DECKS = 6;
const RESHUFFLE_AT = 78; // reshuffle when fewer cards remain (~25% of shoe)

export function newShoe(): Card[] {
  return shuffle(freshDeck(NUM_DECKS));
}

export function initialBJState(): BJGameState {
  return {
    shoe: newShoe(),
    discards: 0,
    dealerCards: [],
    hands: [],
    activeHand: 0,
    phase: 'betting',
    dealerRevealed: false,
    message: null,
  };
}

export function handTotal(cards: Card[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const c of cards) {
    const v = bjValue(c);
    total += v;
    if (v === 11) aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return { total, soft: aces > 0 };
}

export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && handTotal(cards).total === 21;
}

function draw(state: BJGameState): Card {
  if (state.shoe.length === 0) state.shoe = newShoe();
  return state.shoe.pop()!;
}

export function handToEvState(hand: BJHand, canSplit: boolean): HandState {
  const { total, soft } = handTotal(hand.cards);
  const pair =
    hand.cards.length === 2 && bjValue(hand.cards[0]) === bjValue(hand.cards[1])
      ? bjValue(hand.cards[0])
      : null;
  return {
    total,
    soft,
    pairValue: pair,
    isTwoCards: hand.cards.length === 2 && !hand.splitAcesDone,
    canSplit: canSplit && pair !== null,
  };
}

export function dealerUpValue(state: BJGameState): number {
  return bjValue(state.dealerCards[0]);
}

/** deal a new round; returns null if it happened, or an 'immediate' settlement (blackjacks) */
export function deal(state: BJGameState, bet: number): BJGameState {
  let s: BJGameState = { ...state, message: null };
  if (s.shoe.length < RESHUFFLE_AT) {
    s.shoe = newShoe();
    s.discards = 0;
  } else {
    s.shoe = s.shoe.slice();
  }
  const p1 = draw(s), d1 = draw(s), p2 = draw(s), d2 = draw(s);
  const hand: BJHand = {
    cards: [p1, p2],
    bet,
    doubled: false,
    stood: false,
    busted: false,
    fromSplit: false,
    splitAcesDone: false,
  };
  s.dealerCards = [d1, d2];
  s.hands = [hand];
  s.activeHand = 0;
  s.dealerRevealed = false;
  s.phase = 'player';

  const dealerBJ = isBlackjack(s.dealerCards);
  const playerBJ = isBlackjack(hand.cards);
  if (dealerBJ || playerBJ) {
    s.dealerRevealed = true;
    s.phase = 'settled';
    if (dealerBJ && playerBJ) {
      hand.result = 'push';
      hand.payout = 0;
      s.message = 'Both blackjack — push.';
    } else if (dealerBJ) {
      hand.result = 'lose';
      hand.payout = -bet;
      s.message = 'Dealer blackjack.';
    } else {
      hand.result = 'blackjack';
      hand.payout = bet * 1.5;
      s.message = 'Blackjack! Pays 3:2.';
    }
  }
  return s;
}

export interface BJDecisionGrade {
  chosen: BJAction;
  best: BJAction;
  evs: ActionEVs;
  evLoss: number; // in units of the initial bet (>= 0)
  correct: boolean;
}

/** grade an action before applying it */
export function gradeAction(state: BJGameState, action: BJAction): BJDecisionGrade {
  const hand = state.hands[state.activeHand];
  const canSplit = state.hands.length === 1; // one split max
  const evState = handToEvState(hand, canSplit);
  const evs = actionEVs(evState, dealerUpValue(state));
  const best = bestAction(evs);
  const chosenEv = evs[action]!;
  const bestEv = evs[best]!;
  return {
    chosen: action,
    best,
    evs,
    evLoss: Math.max(0, bestEv - chosenEv),
    correct: Math.abs(bestEv - chosenEv) < 1e-9,
  };
}

export function legalActions(state: BJGameState): BJAction[] {
  if (state.phase !== 'player') return [];
  const hand = state.hands[state.activeHand];
  if (hand.splitAcesDone) return [];
  const actions: BJAction[] = ['hit', 'stand'];
  if (hand.cards.length === 2) actions.push('double');
  const canSplit =
    state.hands.length === 1 &&
    hand.cards.length === 2 &&
    bjValue(hand.cards[0]) === bjValue(hand.cards[1]);
  if (canSplit) actions.push('split');
  return actions;
}

function advance(s: BJGameState): BJGameState {
  // move to next unfinished hand or dealer phase
  while (s.activeHand < s.hands.length) {
    const h = s.hands[s.activeHand];
    if (!h.stood && !h.busted && !h.splitAcesDone) return s;
    s.activeHand++;
  }
  return playDealer(s);
}

function playDealer(s: BJGameState): BJGameState {
  s.dealerRevealed = true;
  const allBusted = s.hands.every((h) => h.busted);
  if (!allBusted) {
    s.dealerCards = s.dealerCards.slice();
    while (true) {
      const { total, soft } = handTotal(s.dealerCards);
      if (total >= 17) break; // S17: stand on all 17s
      s.dealerCards.push(draw(s));
    }
  }
  const dealer = handTotal(s.dealerCards);
  const dealerBust = dealer.total > 21;
  for (const h of s.hands) {
    if (h.result) continue;
    const pt = handTotal(h.cards).total;
    if (h.busted) {
      h.result = 'lose';
      h.payout = -h.bet;
    } else if (dealerBust || pt > dealer.total) {
      h.result = 'win';
      h.payout = h.bet;
    } else if (pt < dealer.total) {
      h.result = 'lose';
      h.payout = -h.bet;
    } else {
      h.result = 'push';
      h.payout = 0;
    }
  }
  s.phase = 'settled';
  return s;
}

export function applyAction(state: BJGameState, action: BJAction): BJGameState {
  const s: BJGameState = {
    ...state,
    shoe: state.shoe.slice(),
    hands: state.hands.map((h) => ({ ...h, cards: h.cards.slice() })),
  };
  const hand = s.hands[s.activeHand];
  switch (action) {
    case 'hit': {
      hand.cards.push(draw(s));
      const { total } = handTotal(hand.cards);
      if (total > 21) hand.busted = true;
      else if (total === 21) hand.stood = true;
      break;
    }
    case 'stand':
      hand.stood = true;
      break;
    case 'double': {
      hand.cards.push(draw(s));
      hand.bet *= 2;
      hand.doubled = true;
      const { total } = handTotal(hand.cards);
      if (total > 21) hand.busted = true;
      else hand.stood = true;
      break;
    }
    case 'split': {
      const [c1, c2] = hand.cards;
      const isAces = bjValue(c1) === 11;
      const h1: BJHand = { ...hand, cards: [c1, draw(s)], fromSplit: true, splitAcesDone: false };
      const h2: BJHand = { ...hand, cards: [c2, draw(s)], fromSplit: true, splitAcesDone: false };
      if (isAces) {
        h1.splitAcesDone = true;
        h2.splitAcesDone = true;
      } else {
        // auto-stand on 21 after split
        if (handTotal(h1.cards).total === 21) h1.stood = true;
        if (handTotal(h2.cards).total === 21) h2.stood = true;
      }
      s.hands = [h1, h2];
      s.activeHand = 0;
      break;
    }
  }
  return advance(s);
}
