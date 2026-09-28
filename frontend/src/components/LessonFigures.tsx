// Inline-SVG figures for Strategy School lessons. Drawn with the site's CSS
// variables so they follow the card-room palette; all data is computed
// deterministically at module load so SSR and client output match.

// ---------------------------------------------------------------- variance figure

/** deterministic PRNG so the "random" bankroll paths are stable across builds */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HANDS = 500;
const STEP = 10;
const EV_PER_HAND = -0.06; // $10 flat bets at 0.6% house edge
const SD_PER_HAND = 11.5; // 1.15 bets of $10

/** one simulated $10-flat-bet blackjack session, sampled every STEP hands */
function makePath(seed: number): number[] {
  const rnd = mulberry32(seed);
  const pts = [0];
  let bank = 0;
  for (let h = 0; h < HANDS; h += STEP) {
    for (let i = 0; i < STEP; i++) {
      // sum of 12 uniforms ≈ normal(6, 1)
      let n = 0;
      for (let j = 0; j < 12; j++) n += rnd();
      bank += EV_PER_HAND + (n - 6) * SD_PER_HAND;
    }
    pts.push(bank);
  }
  return pts;
}

const PATH_SEEDS = [11, 23, 47, 61];
const PATHS = PATH_SEEDS.map(makePath);

const W = 680;
const H = 320;
const M = { l: 52, r: 16, t: 14, b: 34 };
const Y_MAX = 400;
const x = (i: number) => M.l + (i / (HANDS / STEP)) * (W - M.l - M.r);
const y = (v: number) => M.t + ((Y_MAX - v) / (2 * Y_MAX)) * (H - M.t - M.b);
const line = (pts: number[]) => pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

export function VarianceFigure() {
  return (
    <figure className="lesson-fig">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Four simulated blackjack sessions of 500 hands swing between plus and minus several hundred dollars while the expected loss line drifts down only about thirty dollars.">
        <text x={M.l} y={M.t - 2} fontSize="11" fill="var(--text-dim)">$ won / lost — four simulated sessions, $10 hands, perfect play</text>
        {[-400, -200, 0, 200, 400].map((v) => (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke={v === 0 ? 'var(--border-strong)' : 'var(--border)'} strokeWidth="1" />
            <text x={M.l - 8} y={y(v) + 4} fontSize="11" fill="var(--text-dim)" textAnchor="end">{v > 0 ? `+${v}` : v}</text>
          </g>
        ))}
        {[0, 100, 200, 300, 400, 500].map((h) => (
          <text key={h} x={x(h / STEP)} y={H - M.b + 16} fontSize="11" fill="var(--text-dim)" textAnchor="middle">{h}</text>
        ))}
        <text x={(M.l + W - M.r) / 2} y={H - 4} fontSize="11" fill="var(--text-dim)" textAnchor="middle">hands played</text>
        {PATHS.map((p, i) => (
          <path key={i} d={line(p)} fill="none" stroke="var(--text-dim)" strokeWidth="1.4" opacity={0.55 + i * 0.08} />
        ))}
        <path d={`M${x(0)} ${y(0)} L${x(HANDS / STEP)} ${y(HANDS * EV_PER_HAND)}`} fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeDasharray="7 5" />
        <text x={x(HANDS / STEP) - 6} y={y(HANDS * EV_PER_HAND) + 18} fontSize="12" fill="var(--gold)" textAnchor="end">expected loss: −$30</text>
      </svg>
      <figcaption>
        Four simulated 500-hand blackjack sessions (perfect play, $10 bets). Any single session is dominated by
        swings of hundreds of dollars — the gold line, the expected loss, drifts down just $30. That gap is
        variance, and it&#39;s why one night proves nothing.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------- pay table figure

const JOB_TABLES = [
  { name: '9/6', ret: 99.54, cost: 3.45 },
  { name: '8/6', ret: 98.39, cost: 12.1 },
  { name: '8/5', ret: 97.3, cost: 20.25 },
  { name: '7/5', ret: 96.15, cost: 28.9 },
];

export function PaytableBarsFigure() {
  const bw = 680;
  const rowH = 44;
  const top = 26;
  const labelW = 46;
  const scaleX = (r: number) => labelW + ((r - 95) / 5) * (bw - labelW - 120);
  return (
    <figure className="lesson-fig">
      <svg viewBox={`0 0 ${bw} ${top + JOB_TABLES.length * rowH + 10}`} role="img" aria-label="Jacks or Better returns by pay table: 9/6 pays 99.54 percent costing about 3 dollars 45 an hour; 7/5 pays 96.15 percent costing about 29 dollars an hour.">
        <text x={labelW} y={14} fontSize="11" fill="var(--text-dim)">Jacks or Better return with perfect play — and what the house keeps per hour ($1.25 bets, 600 hands/hr)</text>
        {JOB_TABLES.map((t, i) => {
          const yPos = top + i * rowH;
          const w = scaleX(t.ret) - labelW;
          const best = i === 0;
          return (
            <g key={t.name}>
              <text x={labelW - 8} y={yPos + 21} fontSize="14" fill="var(--text)" textAnchor="end" fontWeight="700">{t.name}</text>
              <rect x={labelW} y={yPos + 6} width={w} height={22} rx="3" fill={best ? 'var(--gold)' : 'var(--border-strong)'} />
              <text x={labelW + w + 8} y={yPos + 22} fontSize="13" fill={best ? 'var(--gold)' : 'var(--text-dim)'}>
                {t.ret.toFixed(2)}% · ~${t.cost.toFixed(2)}/hr
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        The same game of Jacks or Better at four real pay tables. Nothing about the play changes — the 7/5 glass
        simply keeps eight times as much of your money per hour as the full-pay 9/6 machine.
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------- 3:2 vs 6:5 figure

export function BlackjackPayoutFigure() {
  const bw = 680;
  const rows = [
    { name: '3:2', edge: 0.6, cost: 4.2, good: true },
    { name: '6:5', edge: 2.0, cost: 14.0, good: false },
  ];
  const labelW = 46;
  const scaleX = (e: number) => (e / 2.4) * (bw - labelW - 130);
  return (
    <figure className="lesson-fig">
      <svg viewBox={`0 0 ${bw} 130`} role="img" aria-label="House edge comparison: blackjack paying 3 to 2 has about a 0.6 percent edge costing 4 dollars an hour; 6 to 5 has about 2 percent costing 14 dollars an hour.">
        <text x={labelW} y={14} fontSize="11" fill="var(--text-dim)">House edge by blackjack payout — cost per hour at $10 bets, 70 hands/hr, perfect play</text>
        {rows.map((r, i) => {
          const yPos = 26 + i * 44;
          const w = scaleX(r.edge);
          return (
            <g key={r.name}>
              <text x={labelW - 8} y={yPos + 21} fontSize="14" fill="var(--text)" textAnchor="end" fontWeight="700">{r.name}</text>
              <rect x={labelW} y={yPos + 6} width={w} height={22} rx="3" fill={r.good ? 'var(--gold)' : 'var(--red)'} />
              <text x={labelW + w + 8} y={yPos + 22} fontSize="13" fill={r.good ? 'var(--gold)' : 'var(--red)'}>
                {r.edge.toFixed(1)}% edge · ~${r.cost.toFixed(2)}/hr
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        Identical table, identical strategy — the only difference is the blackjack payout printed on the felt.
        A 6:5 sign more than triples the price of the game. Keep walking.
      </figcaption>
    </figure>
  );
}
