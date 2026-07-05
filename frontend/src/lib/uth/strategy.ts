import { Card, rankOf, suitOf } from '../cards';

// Optimal preflop 4x strategy (Wizard of Odds basic strategy).
// Rank indices: 0=2 ... 8=10(T), 9=J, 10=Q, 11=K, 12=A.

export function shouldRaisePreflop(c1: Card, c2: Card): boolean {
  const r1 = rankOf(c1), r2 = rankOf(c2);
  const hi = Math.max(r1, r2), lo = Math.min(r1, r2);
  const suited = suitOf(c1) === suitOf(c2);

  if (r1 === r2) return r1 >= 1; // any pair except deuces
  if (hi === 12) return true; // any ace
  if (hi === 11) return suited || lo >= 3; // K2s+, K5o+
  if (hi === 10) return suited ? lo >= 4 : lo >= 6; // Q6s+, Q8o+
  if (hi === 9) return suited ? lo >= 6 : lo === 8; // J8s+, JTo
  return false;
}
