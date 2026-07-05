import { Card } from '../cards';
import { eval7 } from '../poker/eval7';
import { settleUTH } from './rules';
import { shouldRaisePreflop } from './strategy';

// EV analysis for Ultimate Texas Hold'em, in ante units.
// River: exact (990 dealer combos). Flop: exact (1,081 runouts x 990 dealer combos).
// Preflop: Monte Carlo with exact river play and heuristic flop play on the check branch.

function remaining(exclude: Card[]): Card[] {
  const ex = new Set(exclude);
  const out: Card[] = [];
  for (let c = 0; c < 52; c++) if (!ex.has(c)) out.push(c);
  return out;
}

export interface RiverEV {
  betEv: number; // EV of betting 1x
  foldEv: number; // always -2
}

/** Exact river analysis: player 2 + full board 5 known. */
export function riverAnalysis(player: Card[], board: Card[]): RiverEV {
  const seven = [...player, ...board];
  const playerScore = eval7(seven);
  const stub = remaining(seven);
  const n = stub.length; // 45
  let total = 0;
  let count = 0;
  const dhand = [...board, 0, 0];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      dhand[5] = stub[i];
      dhand[6] = stub[j];
      total += settleUTH(playerScore, eval7(dhand), 1);
      count++;
    }
  }
  return { betEv: total / count, foldEv: -2 };
}

export interface FlopEV {
  betEv: number; // EV of betting 2x now
  checkEv: number; // EV of checking, then playing the river optimally (exact)
}

/** Exact flop analysis: player 2 + flop 3 known. */
export function flopAnalysis(player: Card[], flop: Card[]): FlopEV {
  const known = [...player, ...flop];
  const stub = remaining(known); // 47
  const n = stub.length;
  let betTotal = 0;
  let checkTotal = 0;
  let boards = 0;
  const pseven = [...player, ...flop, 0, 0];
  const dseven = [...flop, 0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const t = stub[i], r = stub[j];
      pseven[5] = t;
      pseven[6] = r;
      dseven[3] = t;
      dseven[4] = r;
      const playerScore = eval7(pseven);
      let bet2Total = 0;
      let bet1Total = 0;
      let dealers = 0;
      for (let a = 0; a < n; a++) {
        if (a === i || a === j) continue;
        for (let b = a + 1; b < n; b++) {
          if (b === i || b === j) continue;
          dseven[5] = stub[a];
          dseven[6] = stub[b];
          const dealerScore = eval7(dseven);
          bet2Total += settleUTH(playerScore, dealerScore, 2);
          bet1Total += settleUTH(playerScore, dealerScore, 1);
          dealers++;
        }
      }
      betTotal += bet2Total / dealers;
      checkTotal += Math.max(bet1Total / dealers, -2); // optimal river decision
      boards++;
    }
  }
  return { betEv: betTotal / boards, checkEv: checkTotal / boards };
}

export interface PreflopEV {
  raiseEv: number; // EV of betting 4x now
  checkEv: number; // EV of checking then continuing
  samples: number;
}

// heuristic flop continuation for the Monte Carlo check branch:
// bet 2x with a hidden pair (using a hole card, or pocket pair > deuces) or better,
// or four to a flush with a hidden card; otherwise check.
function flopBetHeuristic(player: Card[], flop: Card[]): boolean {
  const pr1 = player[0] % 13, pr2 = player[1] % 13;
  const flopRanks = flop.map((c) => c % 13);
  // pocket pair except deuces
  if (pr1 === pr2 && pr1 >= 1) return true;
  // hole card pairs the board
  if (flopRanks.includes(pr1) || flopRanks.includes(pr2)) return true;
  // two pair or trips on board make everyone play the board; skip (conservative)
  // four to a flush with a hidden T+
  const suits = [0, 0, 0, 0];
  for (const c of [...player, ...flop]) suits[(c / 13) | 0]++;
  for (let s = 0; s < 4; s++) {
    if (suits[s] >= 4) {
      for (const c of player) {
        if (((c / 13) | 0) === s && c % 13 >= 8) return true;
      }
    }
  }
  return false;
}

/**
 * Monte Carlo preflop analysis with common random numbers across both branches.
 * Check branch: heuristic at the flop, exact enumeration at the river.
 */
export function preflopAnalysis(player: Card[], samples = 2500): PreflopEV {
  const stub = remaining(player); // 50
  let raiseTotal = 0;
  let checkTotal = 0;
  const pool = stub.slice();
  const pseven = [player[0], player[1], 0, 0, 0, 0, 0];
  const dseven = [0, 0, 0, 0, 0, 0, 0];

  for (let s = 0; s < samples; s++) {
    // partial Fisher-Yates: draw 7 cards (board 5 + dealer 2)
    for (let i = 0; i < 7; i++) {
      const j = i + Math.floor(Math.random() * (pool.length - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const board = pool.slice(0, 5);
    const dealer = [pool[5], pool[6]];
    for (let i = 0; i < 5; i++) {
      pseven[2 + i] = board[i];
      dseven[i] = board[i];
    }
    dseven[5] = dealer[0];
    dseven[6] = dealer[1];
    const playerScore = eval7(pseven);
    const dealerScore = eval7(dseven);

    // raise branch
    raiseTotal += settleUTH(playerScore, dealerScore, 4);

    // check branch
    const flop = board.slice(0, 3);
    if (flopBetHeuristic(player, flop)) {
      checkTotal += settleUTH(playerScore, dealerScore, 2);
    } else {
      // exact river decision vs the 45-card stub (excluding board; dealer unknown to player)
      const seen = new Set([...player, ...board]);
      let betTotal = 0;
      let count = 0;
      const dh = [board[0], board[1], board[2], board[3], board[4], 0, 0];
      for (let a = 0; a < 52; a++) {
        if (seen.has(a)) continue;
        for (let b = a + 1; b < 52; b++) {
          if (seen.has(b)) continue;
          dh[5] = a;
          dh[6] = b;
          betTotal += settleUTH(playerScore, eval7(dh), 1);
          count++;
        }
      }
      const riverBetEv = betTotal / count;
      if (riverBetEv > -2) {
        // bet 1x: realize against the actual sampled dealer hand
        checkTotal += settleUTH(playerScore, dealerScore, 1);
      } else {
        checkTotal += -2;
      }
    }
  }
  return { raiseEv: raiseTotal / samples, checkEv: checkTotal / samples, samples };
}

export { shouldRaisePreflop };
