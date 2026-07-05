import { Card } from '../cards';
import { evalVP } from '../poker/eval5';
import { evalDeucesWild } from '../poker/deuces';

// Payouts are "for 1" per unit bet, at the max-coin rate (royal = 800).
// returnPct values are the published full-strategy returns for these standard pay tables.

export interface PaytableRow {
  label: string;
  pays: number;
}

export interface Paytable {
  id: string;
  name: string;
  shortName: string;
  returnPct: number;
  rows: PaytableRow[];
  payout(hand: Card[]): { pays: number; label: string };
  wild: boolean;
}

function catLabel(cat: string): string {
  const map: Record<string, string> = {
    'royal-flush': 'Royal Flush',
    'straight-flush': 'Straight Flush',
    'four-kind': 'Four of a Kind',
    'full-house': 'Full House',
    flush: 'Flush',
    straight: 'Straight',
    'three-kind': 'Three of a Kind',
    'two-pair': 'Two Pair',
    'jacks-or-better': 'Jacks or Better',
    'natural-royal': 'Natural Royal Flush',
    'four-deuces': 'Four Deuces',
    'wild-royal': 'Wild Royal Flush',
    'five-kind': 'Five of a Kind',
    'low-pair': 'Low Pair',
    nothing: 'Nothing',
  };
  return map[cat] ?? cat;
}

export const JACKS_OR_BETTER: Paytable = {
  id: 'job-96',
  name: 'Jacks or Better (9/6)',
  shortName: 'Jacks or Better',
  returnPct: 99.5439,
  wild: false,
  rows: [
    { label: 'Royal Flush', pays: 800 },
    { label: 'Straight Flush', pays: 50 },
    { label: 'Four of a Kind', pays: 25 },
    { label: 'Full House', pays: 9 },
    { label: 'Flush', pays: 6 },
    { label: 'Straight', pays: 4 },
    { label: 'Three of a Kind', pays: 3 },
    { label: 'Two Pair', pays: 2 },
    { label: 'Jacks or Better', pays: 1 },
  ],
  payout(hand) {
    const e = evalVP(hand);
    const pays: Record<string, number> = {
      'royal-flush': 800,
      'straight-flush': 50,
      'four-kind': 25,
      'full-house': 9,
      flush: 6,
      straight: 4,
      'three-kind': 3,
      'two-pair': 2,
      'jacks-or-better': 1,
    };
    return { pays: pays[e.cat] ?? 0, label: catLabel(e.cat) };
  },
};

export const BONUS_POKER: Paytable = {
  id: 'bp-85',
  name: 'Bonus Poker (8/5)',
  shortName: 'Bonus Poker',
  returnPct: 99.166,
  wild: false,
  rows: [
    { label: 'Royal Flush', pays: 800 },
    { label: 'Straight Flush', pays: 50 },
    { label: 'Four Aces', pays: 80 },
    { label: 'Four 2s–4s', pays: 40 },
    { label: 'Four 5s–Ks', pays: 25 },
    { label: 'Full House', pays: 8 },
    { label: 'Flush', pays: 5 },
    { label: 'Straight', pays: 4 },
    { label: 'Three of a Kind', pays: 3 },
    { label: 'Two Pair', pays: 2 },
    { label: 'Jacks or Better', pays: 1 },
  ],
  payout(hand) {
    const e = evalVP(hand);
    if (e.cat === 'four-kind') {
      const q = e.quadRank!;
      if (q === 12) return { pays: 80, label: 'Four Aces' };
      if (q <= 2) return { pays: 40, label: 'Four 2s–4s' };
      return { pays: 25, label: 'Four 5s–Ks' };
    }
    const pays: Record<string, number> = {
      'royal-flush': 800,
      'straight-flush': 50,
      'full-house': 8,
      flush: 5,
      straight: 4,
      'three-kind': 3,
      'two-pair': 2,
      'jacks-or-better': 1,
    };
    return { pays: pays[e.cat] ?? 0, label: catLabel(e.cat) };
  },
};

export const DOUBLE_DOUBLE_BONUS: Paytable = {
  id: 'ddb-96',
  name: 'Double Double Bonus (9/6)',
  shortName: 'Double Double Bonus',
  returnPct: 98.9808,
  wild: false,
  rows: [
    { label: 'Royal Flush', pays: 800 },
    { label: 'Four Aces + 2/3/4', pays: 400 },
    { label: 'Four 2s–4s + A–4', pays: 160 },
    { label: 'Four Aces', pays: 160 },
    { label: 'Four 2s–4s', pays: 80 },
    { label: 'Four 5s–Ks', pays: 50 },
    { label: 'Straight Flush', pays: 50 },
    { label: 'Full House', pays: 9 },
    { label: 'Flush', pays: 6 },
    { label: 'Straight', pays: 4 },
    { label: 'Three of a Kind', pays: 3 },
    { label: 'Two Pair', pays: 1 },
    { label: 'Jacks or Better', pays: 1 },
  ],
  payout(hand) {
    const e = evalVP(hand);
    if (e.cat === 'four-kind') {
      const q = e.quadRank!;
      const k = e.quadKicker!;
      if (q === 12) {
        if (k <= 2) return { pays: 400, label: 'Four Aces + 2/3/4' };
        return { pays: 160, label: 'Four Aces' };
      }
      if (q <= 2) {
        if (k === 12 || k <= 2) return { pays: 160, label: 'Four 2s–4s + A–4' };
        return { pays: 80, label: 'Four 2s–4s' };
      }
      return { pays: 50, label: 'Four 5s–Ks' };
    }
    const pays: Record<string, number> = {
      'royal-flush': 800,
      'straight-flush': 50,
      'full-house': 9,
      flush: 6,
      straight: 4,
      'three-kind': 3,
      'two-pair': 1,
      'jacks-or-better': 1,
    };
    return { pays: pays[e.cat] ?? 0, label: catLabel(e.cat) };
  },
};

export const DEUCES_WILD: Paytable = {
  id: 'dw-fp',
  name: 'Deuces Wild (Full Pay)',
  shortName: 'Deuces Wild',
  returnPct: 100.762,
  wild: true,
  rows: [
    { label: 'Natural Royal Flush', pays: 800 },
    { label: 'Four Deuces', pays: 200 },
    { label: 'Wild Royal Flush', pays: 25 },
    { label: 'Five of a Kind', pays: 15 },
    { label: 'Straight Flush', pays: 9 },
    { label: 'Four of a Kind', pays: 5 },
    { label: 'Full House', pays: 3 },
    { label: 'Flush', pays: 2 },
    { label: 'Straight', pays: 2 },
    { label: 'Three of a Kind', pays: 1 },
  ],
  payout(hand) {
    const cat = evalDeucesWild(hand);
    const pays: Record<string, number> = {
      'natural-royal': 800,
      'four-deuces': 200,
      'wild-royal': 25,
      'five-kind': 15,
      'straight-flush': 9,
      'four-kind': 5,
      'full-house': 3,
      flush: 2,
      straight: 2,
      'three-kind': 1,
    };
    return { pays: pays[cat] ?? 0, label: catLabel(cat) };
  },
};

export const PAYTABLES: Paytable[] = [JACKS_OR_BETTER, BONUS_POKER, DOUBLE_DOUBLE_BONUS, DEUCES_WILD];

export function paytableById(id: string): Paytable {
  const pt = PAYTABLES.find((p) => p.id === id);
  if (!pt) throw new Error(`unknown paytable ${id}`);
  return pt;
}
