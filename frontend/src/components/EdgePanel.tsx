import { useSession } from '../store/session';

interface Props {
  gameId: string;
  impliedEdgePct: number;
  /** what one "unit" of wagering means for the edge denominator */
  unitNote: string;
}

const fmtPct = (p: number) => `${p >= 0 ? '' : '−'}${Math.abs(p).toFixed(2)}%`;
const fmtMoney = (n: number) =>
  `${n < 0 ? '−' : ''}$${Math.abs(n).toFixed(2).replace(/\.00$/, '')}`;

export function EdgePanel({ gameId, impliedEdgePct, unitNote }: Props) {
  const session = useSession();
  const s = session.gameStats(gameId);
  const actualEdge = s.wagered > 0 ? impliedEdgePct + (100 * s.evLost) / s.wagered : impliedEdgePct;
  const acc = s.decisions > 0 ? (100 * s.correct) / s.decisions : null;

  return (
    <div className="panel">
      <h4>House Edge</h4>
      <div className="stat-grid">
        <div className="stat">
          <div className="value gold">{fmtPct(impliedEdgePct)}</div>
          <div className="label">implied (perfect play)</div>
        </div>
        <div className="stat">
          <div className={`value ${actualEdge > impliedEdgePct + 0.005 ? 'bad' : 'good'}`}>
            {fmtPct(actualEdge)}
          </div>
          <div className="label">your edge (actual play)</div>
        </div>
        <div className="stat">
          <div className="value">{acc === null ? '—' : `${acc.toFixed(0)}%`}</div>
          <div className="label">
            decisions correct ({s.correct}/{s.decisions})
          </div>
        </div>
        <div className="stat">
          <div className={`value ${s.evLost > 0.005 ? 'bad' : ''}`}>{fmtMoney(s.evLost)}</div>
          <div className="label">EV given up</div>
        </div>
        <div className="stat">
          <div className={`value ${s.net > 0 ? 'good' : s.net < 0 ? 'bad' : ''}`}>{fmtMoney(s.net)}</div>
          <div className="label">session net</div>
        </div>
        <div className="stat">
          <div className="value">{s.rounds}</div>
          <div className="label">rounds played</div>
        </div>
      </div>
      <div className="foot">{unitNote}</div>
      <button className="btn-text" onClick={() => session.resetStats(gameId)}>
        reset session stats
      </button>
    </div>
  );
}
