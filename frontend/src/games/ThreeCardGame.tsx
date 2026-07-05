import { useState } from 'react';
import { BetControl } from '../components/BetControl';
import { CardView } from '../components/CardView';
import { EdgePanel } from '../components/EdgePanel';
import { FeedbackPanel, GradeDisplay } from '../components/Feedback';
import { Card, freshDeck, shuffle } from '../lib/cards';
import { anteBonus, cat3, dealerQualifies3, eval3, threeCardAnalysis } from '../lib/threecard/ev';
import { useSession } from '../store/session';

const GAME = 'threecard';
const IMPLIED_EDGE = 3.37; // % of ante, ante+play with optimal Q-6-4 strategy

const CAT_NAMES = ['High Card', 'Pair', 'Flush', 'Straight', 'Three of a Kind', 'Straight Flush'];

type Phase = 'bet' | 'decide' | 'done';

interface Round {
  player: Card[];
  dealer: Card[];
  folded: boolean;
  message: string;
  net: number;
}

export function ThreeCardGame() {
  const session = useSession();
  const [ante, setAnte] = useState(10);
  const [phase, setPhase] = useState<Phase>('bet');
  const [round, setRound] = useState<Round | null>(null);
  const [grade, setGrade] = useState<GradeDisplay | null>(null);

  function onDeal() {
    if (session.state.bankroll < ante) return;
    session.spend(GAME, ante);
    session.wager(GAME, ante);
    session.round(GAME);
    const deck = shuffle(freshDeck());
    setRound({ player: deck.slice(0, 3), dealer: deck.slice(3, 6), folded: false, message: '', net: 0 });
    setGrade(null);
    setPhase('decide');
  }

  function onDecide(play: boolean) {
    const r = round!;
    const a = threeCardAnalysis(r.player);
    const bestIsPlay = a.playEv >= a.foldEv;
    const correct = play === bestIsPlay;
    const cost = correct ? 0 : Math.abs(a.playEv - a.foldEv) * ante;
    session.decision(GAME, correct, cost);
    setGrade({
      correct,
      chosenLabel: play ? 'Play' : 'Fold',
      bestLabel: bestIsPlay ? 'Play' : 'Fold',
      costDollars: cost,
      note: 'Exact enumeration of all 18,424 dealer hands. Book rule: play Q-6-4 or better.',
      lines: [
        { label: 'Play', ev: a.playEv, isBest: bestIsPlay, isChosen: play },
        { label: 'Fold', ev: a.foldEv, isBest: !bestIsPlay, isChosen: !play },
      ],
    });

    if (!play) {
      setRound({ ...r, folded: true, message: `Folded — lose $${ante} ante.`, net: -ante });
      setPhase('done');
      return;
    }

    session.spend(GAME, ante); // play bet
    const ps = eval3(r.player[0], r.player[1], r.player[2]);
    const ds = eval3(r.dealer[0], r.dealer[1], r.dealer[2]);
    const bonus = anteBonus(cat3(ps));
    let net: number;
    let msg: string;
    if (!dealerQualifies3(ds)) {
      net = 1 + bonus;
      msg = 'Dealer does not qualify — ante pays, play pushes.';
    } else if (ps > ds) {
      net = 2 + bonus;
      msg = `${CAT_NAMES[cat3(ps)]} beats dealer ${CAT_NAMES[cat3(ds)]}.`;
    } else if (ps < ds) {
      net = -2 + bonus;
      msg = `Dealer ${CAT_NAMES[cat3(ds)]} beats your ${CAT_NAMES[cat3(ps)]}.`;
    } else {
      net = 0 + bonus;
      msg = 'Push.';
    }
    if (bonus > 0) msg += ` Ante bonus pays ${bonus}×!`;
    const netDollars = net * ante;
    session.receive(GAME, 2 * ante + netDollars);
    setRound({ ...r, message: `${msg} ${netDollars > 0 ? `Win $${netDollars}` : netDollars < 0 ? `Lose $${-netDollars}` : ''}`, net: netDollars });
    setPhase('done');
  }

  return (
    <div className="game-page">
      <div className="table-panel">
        <div className="game-title-row">
          <h2>Three Card Poker</h2>
          <span className="rules-note">ante + play · dealer qualifies with Q-high · ante bonus on straight+</span>
        </div>

        <div className="seat-label">Dealer</div>
        <div className="card-row">
          {(round?.dealer ?? [0, 0, 0]).map((c, i) => (
            <CardView key={i} card={round ? c : undefined} faceDown={!round || phase === 'decide'} />
          ))}
        </div>

        <div className="seat-label">Your hand {round && phase !== 'bet' ? `— ${CAT_NAMES[cat3(eval3(round.player[0], round.player[1], round.player[2]))]}` : ''}</div>
        <div className="card-row">
          {(round?.player ?? [0, 0, 0]).map((c, i) => (
            <CardView key={i} card={round ? c : undefined} faceDown={!round} />
          ))}
        </div>

        {phase === 'done' && round && (
          <div className={`table-msg ${round.net > 0 ? 'win' : round.net < 0 ? 'lose' : ''}`}>{round.message}</div>
        )}

        {phase === 'decide' ? (
          <div className="action-row">
            <button
              className="btn-action primary"
              onClick={() => onDecide(true)}
              disabled={session.state.bankroll < ante}
            >
              Play (${ante})
            </button>
            <button className="btn-action danger" onClick={() => onDecide(false)}>
              Fold
            </button>
          </div>
        ) : (
          <>
            <BetControl label="Ante" value={ante} onChange={setAnte} />
            <div className="action-row">
              <button className="btn-action primary" onClick={onDeal} disabled={session.state.bankroll < ante}>
                Deal — ${ante}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="side-panel">
        <EdgePanel
          gameId={GAME}
          impliedEdgePct={IMPLIED_EDGE}
          unitNote="Edge as % of one ante (ante + play, no Pair Plus). Decision EVs are exact — every possible dealer hand is enumerated."
        />
        <FeedbackPanel grade={grade} unitLabel="antes" />
      </div>
    </div>
  );
}
