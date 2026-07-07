import { useMemo } from 'react';
import { actionEVs, bestAction, HandState } from '../lib/blackjack/ev';

// Basic strategy charts generated live from the EV engine (6 decks, S17, DAS)
// so the Strategy School and the quick-reference card always match the trainer.

const DEALER_UPS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const UP_LABELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

export type Cell = 'H' | 'S' | 'D' | 'Ds' | 'P';

function decide(state: HandState, up: number): Cell {
  const evs = actionEVs(state, up);
  const best = bestAction(evs);
  if (best === 'split') return 'P';
  if (best === 'double') return evs.stand! > evs.hit! ? 'Ds' : 'D';
  return best === 'hit' ? 'H' : 'S';
}

export function useBlackjackCharts() {
  return useMemo(() => {
    const hard: { label: string; cells: Cell[] }[] = [];
    for (let total = 8; total <= 17; total++) {
      hard.push({
        label: String(total),
        cells: DEALER_UPS.map((up) =>
          decide({ total, soft: false, pairValue: null, isTwoCards: true, canSplit: false }, up),
        ),
      });
    }
    const soft: { label: string; cells: Cell[] }[] = [];
    for (let total = 13; total <= 20; total++) {
      soft.push({
        label: `A,${total - 11}`,
        cells: DEALER_UPS.map((up) =>
          decide({ total, soft: true, pairValue: null, isTwoCards: true, canSplit: false }, up),
        ),
      });
    }
    const pairs: { label: string; cells: Cell[] }[] = [];
    for (const v of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      const total = v === 11 ? 12 : v * 2;
      pairs.push({
        label: v === 11 ? 'A,A' : `${v},${v}`,
        cells: DEALER_UPS.map((up) =>
          decide({ total, soft: v === 11, pairValue: v, isTwoCards: true, canSplit: true }, up),
        ),
      });
    }
    return { hard, soft, pairs };
  }, []);
}

export function StratChart({ rows, caption }: { rows: { label: string; cells: Cell[] }[]; caption?: string }) {
  return (
    <div className="table-scroll">
      <table className="strat-table">
        {caption && (
          <caption style={{ captionSide: 'bottom', fontSize: 11, color: 'var(--text-dim)', paddingTop: 6 }}>
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            <th className="rowhead">You</th>
            {UP_LABELS.map((u) => (
              <th key={u}>{u}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="rowhead">{r.label}</td>
              {r.cells.map((c, i) => (
                <td key={i} className={c}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Legend({ compact }: { compact?: boolean }) {
  return (
    <div className="strat-legend">
      <span><span className="key" style={{ background: 'rgba(224,87,79,.28)' }} />H = Hit{!compact && ' (take a card)'}</span>
      <span><span className="key" style={{ background: 'rgba(76,186,119,.26)' }} />S = Stand{!compact && ' (stop)'}</span>
      <span><span className="key" style={{ background: 'rgba(88,146,227,.3)' }} />D = Double (else hit) · Ds = Double (else stand)</span>
      <span><span className="key" style={{ background: 'rgba(217,171,74,.32)' }} />P = Split{!compact && ' the pair'}</span>
    </div>
  );
}
