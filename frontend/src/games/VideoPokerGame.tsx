import { useEffect, useRef, useState } from 'react';
import { BetControl } from '../components/BetControl';
import { CardView } from '../components/CardView';
import { EdgePanel } from '../components/EdgePanel';
import { FeedbackPanel, GradeDisplay, VerdictChip } from '../components/Feedback';
import { Card, cardLabel, freshDeck, shuffle } from '../lib/cards';
import { HoldAnalysis } from '../lib/videopoker/ev';
import { PAYTABLES, paytableById } from '../lib/videopoker/paytables';
import { useSession } from '../store/session';
import { Hk, useHotkeys } from '../lib/useHotkeys';

const GAME = 'videopoker';
const HAND_COUNTS = [1, 3, 5, 10];
const REVEAL_STEP_MS = 380;

interface HandResult {
  cards: Card[];
  pays: number;
  label: string;
}

export function VideoPokerGame() {
  const session = useSession();
  const [paytableId, setPaytableId] = useState(PAYTABLES[0].id);
  const [numHands, setNumHands] = useState(1);
  const [betPerHand, setBetPerHand] = useState(5);
  const [phase, setPhase] = useState<'bet' | 'hold' | 'done'>('bet');
  const [dealCards, setDealCards] = useState<Card[]>([]);
  const [holds, setHolds] = useState<boolean[]>([false, false, false, false, false]);
  const [results, setResults] = useState<HandResult[]>([]);
  const [revealed, setRevealed] = useState(0); // hands whose draws are visible
  const [grade, setGrade] = useState<GradeDisplay | 'pending' | null>(null);
  const [totalWon, setTotalWon] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const analysisRef = useRef<Promise<HoldAnalysis> | null>(null);
  const requestIdRef = useRef(0);
  const revealTimer = useRef<number | null>(null);

  const paytable = paytableById(paytableId);
  const impliedEdge = 100 - paytable.returnPct;
  const totalBet = betPerHand * numHands;
  const fullyRevealed = revealed >= numHands;

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      if (revealTimer.current !== null) window.clearInterval(revealTimer.current);
    },
    [],
  );

  function analyze(deal: Card[]): Promise<HoldAnalysis> {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../lib/videopoker/evWorker.ts', import.meta.url), {
        type: 'module',
      });
    }
    const worker = workerRef.current;
    const requestId = ++requestIdRef.current;
    return new Promise((resolve) => {
      const onMsg = (e: MessageEvent) => {
        if (e.data.requestId === requestId) {
          worker.removeEventListener('message', onMsg);
          resolve(e.data as HoldAnalysis);
        }
      };
      worker.addEventListener('message', onMsg);
      worker.postMessage({ requestId, deal, paytableId });
    });
  }

  function stopRevealTimer() {
    if (revealTimer.current !== null) {
      window.clearInterval(revealTimer.current);
      revealTimer.current = null;
    }
  }

  function onDeal() {
    if (session.state.bankroll < totalBet) return;
    stopRevealTimer();
    session.spend(GAME, totalBet);
    session.wager(GAME, totalBet);
    session.round(GAME);
    const deck = shuffle(freshDeck());
    const deal = deck.slice(0, 5);
    setDealCards(deal);
    setHolds([false, false, false, false, false]);
    setResults([]);
    setRevealed(0);
    setGrade(null);
    setTotalWon(0);
    setPhase('hold');
    analysisRef.current = analyze(deal);
  }

  async function onDraw() {
    setGrade('pending');
    const userMask = holds.reduce((m, h, i) => m | (h ? 1 << i : 0), 0);

    // draw each hand independently from its own shuffled 47-card stub
    const dealtSet = new Set(dealCards);
    const stubBase: Card[] = [];
    for (let c = 0; c < 52; c++) if (!dealtSet.has(c)) stubBase.push(c);

    const newResults: HandResult[] = [];
    let won = 0;
    for (let h = 0; h < numHands; h++) {
      const stub = shuffle(stubBase);
      let si = 0;
      const cards = dealCards.map((c, i) => (userMask & (1 << i) ? c : stub[si++]));
      const { pays, label } = paytable.payout(cards);
      newResults.push({ cards, pays: pays * betPerHand, label });
      won += pays * betPerHand;
    }
    setResults(newResults);
    setTotalWon(won);
    setPhase('done');
    if (won > 0) session.receive(GAME, won);

    // reveal draws hand by hand, like a live multi-hand machine
    if (!session.state.animations || numHands === 1) {
      setRevealed(numHands);
    } else {
      setRevealed(1);
      let shown = 1;
      revealTimer.current = window.setInterval(() => {
        shown++;
        setRevealed(shown);
        if (shown >= numHands) stopRevealTimer();
      }, REVEAL_STEP_MS);
    }

    const analysis = await analysisRef.current!;
    const userEv = analysis.evs[userMask];
    const correct = userEv >= analysis.bestEv - 1e-9;
    const evLost = (analysis.bestEv - userEv) * totalBet;
    session.decision(GAME, correct, evLost);
    const holdLabel = (mask: number) => {
      const held = dealCards.filter((_, i) => mask & (1 << i));
      return held.length === 0 ? 'discard everything' : `hold ${held.map(cardLabel).join(' ')}`;
    };
    setGrade({
      correct,
      chosenLabel: holdLabel(userMask),
      bestLabel: holdLabel(analysis.bestMask),
      costDollars: evLost,
      lines: [
        { label: 'Your hold', ev: userEv, isBest: correct, isChosen: true },
        ...(correct ? [] : [{ label: 'Best hold', ev: analysis.bestEv, isBest: true, isChosen: false }]),
      ],
    });
  }

  const wonLabels = new Set(fullyRevealed ? results.filter((r) => r.pays > 0).map((r) => r.label) : []);

  const canDeal =
    (phase === 'bet' || (phase === 'done' && fullyRevealed)) && session.state.bankroll >= totalBet;
  const toggleHold = (i: number) =>
    phase === 'hold' ? () => setHolds((h) => h.map((v, j) => (j === i ? !v : v))) : undefined;
  const dealOrDraw = phase === 'hold' ? onDraw : canDeal ? onDeal : undefined;
  useHotkeys({
    '1': toggleHold(0),
    '2': toggleHold(1),
    '3': toggleHold(2),
    '4': toggleHold(3),
    '5': toggleHold(4),
    space: dealOrDraw,
    enter: dealOrDraw,
    d: dealOrDraw,
    b: phase === 'done' && fullyRevealed ? () => setPhase('bet') : undefined,
  });

  /** one small upper row for hand index h (1..numHands-1) */
  function upperRow(h: number) {
    const isRevealed = phase === 'done' && h < revealed;
    const r = results[h];
    return (
      <div key={h} className="vp-hand-row">
        <span className="vp-hand-label">
          {isRevealed ? (r.pays > 0 ? `${r.label} +$${r.pays}` : '—') : ''}
        </span>
        {dealCards.map((c, j) => {
          if (isRevealed) {
            return <CardView key={`${r.cards[j]}-${j}`} card={r.cards[j]} small dim={r.pays === 0} />;
          }
          return holds[j] ? (
            <CardView key={`${c}-${j}`} card={c} small />
          ) : (
            <CardView key={`back-${j}`} faceDown small />
          );
        })}
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="table-panel">
        <div className="game-title-row">
          <h2>Video Poker</h2>
          <VerdictChip grade={grade} />
          <span className="rules-note">{paytable.name} · max-coin pays</span>
        </div>

        {phase === 'bet' && (
          <>
            <div className="bet-controls">
              <label>Game</label>
              <select value={paytableId} onChange={(e) => setPaytableId(e.target.value)}>
                {PAYTABLES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <label>Hands</label>
              <select value={numHands} onChange={(e) => setNumHands(Number(e.target.value))}>
                {HAND_COUNTS.map((n) => (
                  <option key={n} value={n}>
                    {n} hand{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <BetControl label="Bet / hand" value={betPerHand} onChange={setBetPerHand} chips={[1, 5, 25]} />
            <div className="action-row">
              <button className="btn-action primary" onClick={onDeal} disabled={session.state.bankroll < totalBet}>
                Deal — ${totalBet} <Hk k="Space" />
              </button>
            </div>
          </>
        )}

        {phase !== 'bet' && (
          <>
            {numHands > 1 && (
              <div style={{ marginBottom: 14, maxHeight: 380, overflowY: 'auto' }}>
                {Array.from({ length: numHands - 1 }, (_, i) => numHands - 1 - i).map(upperRow)}
              </div>
            )}

            <div className="seat-label">
              {phase === 'hold'
                ? 'Tap cards (or press 1–5) to hold, then draw'
                : revealed >= 1
                  ? `${results[0].label}${results[0].pays > 0 ? ` +$${results[0].pays}` : ''}`
                  : ''}
            </div>
            <div className="card-row" style={{ paddingBottom: 20 }}>
              {(phase === 'hold' ? dealCards : results[0]?.cards ?? dealCards).map((c, i) => (
                <CardView
                  key={`${c}-${i}`}
                  card={c}
                  selectable={phase === 'hold'}
                  held={phase === 'hold' && holds[i]}
                  dim={phase === 'done' && numHands > 1 && revealed >= 1 && results[0].pays === 0}
                  onClick={
                    phase === 'hold' ? () => setHolds((h) => h.map((v, j) => (j === i ? !v : v))) : undefined
                  }
                />
              ))}
            </div>

            {phase === 'done' && fullyRevealed && (
              <div className={`table-msg ${totalWon > totalBet ? 'win' : totalWon === 0 ? 'lose' : ''}`}>
                {totalWon > 0 ? `Returned $${totalWon} on $${totalBet} bet.` : `No winners — $${totalBet} to the house.`}
              </div>
            )}

            <div className="action-row">
              {phase === 'hold' && (
                <button className="btn-action primary" onClick={onDraw}>
                  Draw <Hk k="Space" />
                </button>
              )}
              {phase === 'done' && (
                <button
                  className="btn-action primary"
                  onClick={onDeal}
                  disabled={!fullyRevealed || session.state.bankroll < totalBet}
                >
                  Deal again — ${totalBet} <Hk k="Space" />
                </button>
              )}
              {phase === 'done' && (
                <button className="btn-action" disabled={!fullyRevealed} onClick={() => setPhase('bet')}>
                  Change game / bet <Hk k="B" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="side-panel">
        <FeedbackPanel grade={grade} unitLabel="× bet" />
        <EdgePanel
          gameId={GAME}
          impliedEdgePct={impliedEdge}
          unitNote={`Edge as % of total amount bet. ${paytable.name} returns ${paytable.returnPct}% with perfect play${impliedEdge < 0 ? ' — a player edge!' : ''}. Hold EVs are exact (all 32 holds × every possible draw).`}
        />
        <div className="panel">
          <h4>Pay Table (per 1 bet)</h4>
          <table className="paytable-list">
            <tbody>
              {paytable.rows.map((r) => (
                <tr key={r.label} className={wonLabels.has(r.label) ? 'hit' : ''}>
                  <td>{r.label}</td>
                  <td>{r.pays}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
