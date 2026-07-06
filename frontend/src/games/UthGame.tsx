import { useEffect, useRef, useState } from 'react';
import { BetControl } from '../components/BetControl';
import { CardView } from '../components/CardView';
import { EdgePanel } from '../components/EdgePanel';
import { FeedbackPanel, GradeDisplay, VerdictChip } from '../components/Feedback';
import { Card, freshDeck, shuffle } from '../lib/cards';
import { catOf, eval7 } from '../lib/poker/eval7';
import { FlopEV, PreflopEV, RiverEV } from '../lib/uth/ev';
import { settleUTH } from '../lib/uth/rules';
import { shouldRaisePreflop } from '../lib/uth/strategy';
import { useSession } from '../store/session';

const GAME = 'uth';
const IMPLIED_EDGE = 2.185; // % of one ante, optimal strategy (Wizard of Odds)

const CAT_NAMES = [
  'High Card',
  'Pair',
  'Two Pair',
  'Three of a Kind',
  'Straight',
  'Flush',
  'Full House',
  'Four of a Kind',
  'Straight Flush',
];

type Phase = 'bet' | 'preflop' | 'flop' | 'river' | 'done';

interface Round {
  player: Card[];
  dealer: Card[];
  board: Card[];
  playMult: number;
  folded: boolean;
  net: number; // ante units, once settled
}

export function UthGame() {
  const session = useSession();
  const [ante, setAnte] = useState(10);
  const [phase, setPhase] = useState<Phase>('bet');
  const [round, setRound] = useState<Round | null>(null);
  const [grade, setGrade] = useState<GradeDisplay | 'pending' | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const roundToken = useRef(0);
  const requestIdRef = useRef(0);
  const stagePromises = useRef<{
    preflop?: Promise<PreflopEV>;
    flop?: Promise<FlopEV>;
    river?: Promise<RiverEV>;
  }>({});

  useEffect(() => () => workerRef.current?.terminate(), []);

  function askWorker<T>(stage: 'preflop' | 'flop' | 'river', player: Card[], board: Card[]): Promise<T> {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../lib/uth/evWorker.ts', import.meta.url), { type: 'module' });
    }
    const worker = workerRef.current;
    const requestId = ++requestIdRef.current;
    return new Promise((resolve) => {
      const onMsg = (e: MessageEvent) => {
        if (e.data.requestId === requestId) {
          worker.removeEventListener('message', onMsg);
          resolve(e.data.result as T);
        }
      };
      worker.addEventListener('message', onMsg);
      worker.postMessage({ requestId, stage, player, board });
    });
  }

  function onDeal() {
    if (session.state.bankroll < 2 * ante) return;
    session.spend(GAME, 2 * ante); // ante + blind
    session.wager(GAME, ante);
    session.round(GAME);
    const deck = shuffle(freshDeck());
    const r: Round = {
      player: deck.slice(0, 2),
      dealer: deck.slice(2, 4),
      board: deck.slice(4, 9),
      playMult: 0,
      folded: false,
      net: 0,
    };
    roundToken.current++;
    setRound(r);
    setGrade(null);
    setPhase('preflop');
    stagePromises.current = { preflop: askWorker<PreflopEV>('preflop', r.player, []) };
  }

  function showdown(r: Round, playMult: number): Round {
    const playerScore = eval7([...r.player, ...r.board]);
    const dealerScore = eval7([...r.dealer, ...r.board]);
    const net = settleUTH(playerScore, dealerScore, playMult);
    const staked = (2 + playMult) * ante;
    session.receive(GAME, staked + net * ante);
    return { ...r, playMult, net, folded: false };
  }

  async function gradePreflop(chose: 'raise' | 'check') {
    setGrade('pending');
    const r = round!;
    const chartRaise = shouldRaisePreflop(r.player[0], r.player[1]);
    const correct = (chose === 'raise') === chartRaise;
    const a = await stagePromises.current.preflop!;
    const chosenEv = chose === 'raise' ? a.raiseEv : a.checkEv;
    const bestEv = chartRaise ? a.raiseEv : a.checkEv;
    const cost = correct ? 0 : Math.max(0, bestEv - chosenEv) * ante;
    session.decision(GAME, correct, cost);
    setGrade({
      correct,
      chosenLabel: chose === 'raise' ? 'Bet 4×' : 'Check',
      bestLabel: chartRaise ? 'Bet 4×' : 'Check',
      costDollars: cost,
      note: `Monte Carlo estimate (${a.samples.toLocaleString()} deals): Bet 4× EV ${a.raiseEv.toFixed(3)}, Check EV ${a.checkEv.toFixed(3)} antes. Verdict from the optimal preflop chart.`,
      lines: [
        { label: 'Bet 4×', ev: a.raiseEv, isBest: chartRaise, isChosen: chose === 'raise' },
        { label: 'Check', ev: a.checkEv, isBest: !chartRaise, isChosen: chose === 'check' },
      ],
    });
  }

  async function gradeFlop(chose: 'raise' | 'check') {
    setGrade('pending');
    const a = await stagePromises.current.flop!;
    const bestIsRaise = a.betEv >= a.checkEv;
    const correct = (chose === 'raise') === bestIsRaise;
    const cost = correct ? 0 : Math.abs(a.betEv - a.checkEv) * ante;
    session.decision(GAME, correct, cost);
    setGrade({
      correct,
      chosenLabel: chose === 'raise' ? 'Bet 2×' : 'Check',
      bestLabel: bestIsRaise ? 'Bet 2×' : 'Check',
      costDollars: cost,
      note: 'Exact enumeration of every turn/river and dealer hand.',
      lines: [
        { label: 'Bet 2×', ev: a.betEv, isBest: bestIsRaise, isChosen: chose === 'raise' },
        { label: 'Check', ev: a.checkEv, isBest: !bestIsRaise, isChosen: chose === 'check' },
      ],
    });
  }

  async function gradeRiver(chose: 'bet' | 'fold') {
    setGrade('pending');
    const a = await stagePromises.current.river!;
    const bestIsBet = a.betEv >= a.foldEv;
    const correct = (chose === 'bet') === bestIsBet;
    const cost = correct ? 0 : Math.abs(a.betEv - a.foldEv) * ante;
    session.decision(GAME, correct, cost);
    setGrade({
      correct,
      chosenLabel: chose === 'bet' ? 'Bet 1×' : 'Fold',
      bestLabel: bestIsBet ? 'Bet 1×' : 'Fold',
      costDollars: cost,
      note: 'Exact enumeration of all 990 possible dealer hands.',
      lines: [
        { label: 'Bet 1×', ev: a.betEv, isBest: bestIsBet, isChosen: chose === 'bet' },
        { label: 'Fold', ev: a.foldEv, isBest: !bestIsBet, isChosen: chose === 'fold' },
      ],
    });
  }

  function onPreflop(chose: 'raise' | 'check') {
    const r = round!;
    void gradePreflop(chose);
    if (chose === 'raise') {
      session.spend(GAME, 4 * ante);
      setRound(showdown(r, 4));
      setPhase('done');
    } else {
      setPhase('flop');
      stagePromises.current.flop = askWorker<FlopEV>('flop', r.player, r.board.slice(0, 3));
    }
  }

  function onFlop(chose: 'raise' | 'check') {
    const r = round!;
    void gradeFlop(chose);
    if (chose === 'raise') {
      session.spend(GAME, 2 * ante);
      setRound(showdown(r, 2));
      setPhase('done');
    } else {
      setPhase('river');
      stagePromises.current.river = askWorker<RiverEV>('river', r.player, r.board);
    }
  }

  function onRiver(chose: 'bet' | 'fold') {
    const r = round!;
    void gradeRiver(chose);
    if (chose === 'bet') {
      session.spend(GAME, ante);
      setRound(showdown(r, 1));
    } else {
      setRound({ ...r, folded: true, net: -2 });
    }
    setPhase('done');
  }

  const boardVisible = phase === 'flop' ? 3 : phase === 'river' || phase === 'done' ? 5 : 0;
  const playerCat = round && phase === 'done' ? CAT_NAMES[catOf(eval7([...round.player, ...round.board]))] : null;
  const dealerCat = round && phase === 'done' ? CAT_NAMES[catOf(eval7([...round.dealer, ...round.board]))] : null;
  const netDollars = round ? round.net * ante : 0;

  return (
    <div className="game-page">
      <div className="table-panel">
        <div className="game-title-row">
          <h2>Ultimate Texas Hold&#39;em</h2>
          <VerdictChip grade={grade} />
          <span className="rules-note">ante + blind · check/bet 4× → 2× → 1×/fold · dealer opens with a pair</span>
        </div>

        <div className="seat-label">Dealer {phase === 'done' && dealerCat ? `— ${dealerCat}` : ''}</div>
        <div className="card-row">
          {(round?.dealer ?? []).map((c, i) => (
            <CardView key={`${c}-${i}`} card={c} faceDown={phase !== 'done'} />
          ))}
          {!round && (
            <>
              <CardView faceDown />
              <CardView faceDown />
            </>
          )}
        </div>

        <div className="seat-label">Board</div>
        <div className="card-row">
          {round &&
            round.board.map((c, i) => (
              <CardView key={`${c}-${i}`} card={c} faceDown={i >= boardVisible} small={false} />
            ))}
          {!round && [0, 1, 2, 3, 4].map((i) => <CardView key={i} faceDown />)}
        </div>

        <div className="seat-label">
          Your hand {phase === 'done' && playerCat ? `— ${playerCat}` : ''}
          {round && phase !== 'bet' && ` · ante $${ante} + blind $${ante}${round.playMult ? ` + play $${round.playMult * ante}` : ''}`}
        </div>
        <div className="card-row">
          {(round?.player ?? []).map((c, i) => (
            <CardView key={`${c}-${i}`} card={c} />
          ))}
          {!round && (
            <>
              <CardView faceDown />
              <CardView faceDown />
            </>
          )}
        </div>

        {phase === 'done' && round && (
          <div className={`table-msg ${netDollars > 0 ? 'win' : netDollars < 0 ? 'lose' : ''}`}>
            {round.folded
              ? `Folded — lose ante + blind ($${2 * ante}).`
              : `${playerCat} vs dealer ${dealerCat} — ${netDollars > 0 ? `win $${netDollars}` : netDollars < 0 ? `lose $${-netDollars}` : 'push'}.`}
          </div>
        )}

        {phase === 'bet' || phase === 'done' ? (
          <>
            <BetControl label="Ante (blind matches)" value={ante} onChange={setAnte} />
            <div className="action-row">
              <button
                className="btn-action primary"
                onClick={onDeal}
                disabled={session.state.bankroll < 2 * ante}
              >
                Deal — ${2 * ante} (ante + blind)
              </button>
            </div>
          </>
        ) : (
          <div className="action-row">
            {phase === 'preflop' && (
              <>
                <button
                  className="btn-action primary"
                  onClick={() => onPreflop('raise')}
                  disabled={session.state.bankroll < 4 * ante}
                >
                  Bet 4× (${4 * ante})
                </button>
                <button className="btn-action" onClick={() => onPreflop('check')}>
                  Check
                </button>
              </>
            )}
            {phase === 'flop' && (
              <>
                <button
                  className="btn-action primary"
                  onClick={() => onFlop('raise')}
                  disabled={session.state.bankroll < 2 * ante}
                >
                  Bet 2× (${2 * ante})
                </button>
                <button className="btn-action" onClick={() => onFlop('check')}>
                  Check
                </button>
              </>
            )}
            {phase === 'river' && (
              <>
                <button
                  className="btn-action primary"
                  onClick={() => onRiver('bet')}
                  disabled={session.state.bankroll < ante}
                >
                  Bet 1× (${ante})
                </button>
                <button className="btn-action danger" onClick={() => onRiver('fold')}>
                  Fold
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="side-panel">
        <FeedbackPanel grade={grade} unitLabel="antes" />
        <EdgePanel
          gameId={GAME}
          impliedEdgePct={IMPLIED_EDGE}
          unitNote="Edge as % of one ante (industry convention). Blind pays on straight or better; ante pushes unless the dealer opens with a pair. Flop and river grades are exact; preflop uses the optimal chart with a Monte Carlo EV estimate."
        />
      </div>
    </div>
  );
}
