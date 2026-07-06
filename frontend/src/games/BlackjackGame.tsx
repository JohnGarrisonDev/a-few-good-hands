import { useMemo, useState } from 'react';
import { BetControl } from '../components/BetControl';
import { CardView } from '../components/CardView';
import { EdgePanel } from '../components/EdgePanel';
import { FeedbackPanel, GradeDisplay, VerdictChip } from '../components/Feedback';
import { houseEdge, BJAction } from '../lib/blackjack/ev';
import {
  BJGameState,
  applyAction,
  deal,
  gradeAction,
  handTotal,
  initialBJState,
  legalActions,
} from '../lib/blackjack/game';
import { useSession } from '../store/session';

const GAME = 'blackjack';
const ACTION_LABELS: Record<BJAction, string> = {
  hit: 'Hit',
  stand: 'Stand',
  double: 'Double',
  split: 'Split',
};

export function BlackjackGame() {
  const session = useSession();
  const [game, setGame] = useState<BJGameState>(initialBJState);
  const [bet, setBet] = useState(25);
  const [grade, setGrade] = useState<GradeDisplay | null>(null);
  const impliedEdge = useMemo(() => houseEdge() * 100, []);

  const inRound = game.phase === 'player';
  const actions = legalActions(game);

  function settle(s: BJGameState) {
    if (s.phase === 'settled' && s.hands.length > 0) {
      let ret = 0;
      for (const h of s.hands) ret += h.bet + (h.payout ?? 0);
      if (ret > 0) session.receive(GAME, ret);
    }
  }

  function onDeal() {
    if (session.state.bankroll < bet) return;
    session.spend(GAME, bet);
    session.wager(GAME, bet);
    session.round(GAME);
    const s = deal(game, bet);
    setGame(s);
    settle(s);
  }

  function onAction(a: BJAction) {
    const hand = game.hands[game.activeHand];
    const g = gradeAction(game, a);
    setGrade({
      correct: g.correct,
      chosenLabel: ACTION_LABELS[g.chosen],
      bestLabel: ACTION_LABELS[g.best],
      costDollars: g.evLoss * hand.bet,
      lines: (Object.entries(g.evs) as [BJAction, number][]).map(([act, ev]) => ({
        label: ACTION_LABELS[act],
        ev,
        isBest: act === g.best,
        isChosen: act === g.chosen,
      })),
    });
    session.decision(GAME, g.correct, g.evLoss * hand.bet);
    if (a === 'double' || a === 'split') session.spend(GAME, hand.bet);
    const s = applyAction(game, a);
    setGame(s);
    settle(s);
  }

  const dealerT = game.dealerCards.length ? handTotal(game.dealerRevealed ? game.dealerCards : [game.dealerCards[0]]) : null;

  return (
    <div className="game-page">
      <div className="table-panel">
        <div className="game-title-row">
          <h2>Blackjack</h2>
          <VerdictChip grade={grade} />
          <span className="rules-note">6 decks · dealer stands all 17s · double after split · blackjack pays 3:2</span>
        </div>

        <div className="seat-label">
          Dealer {dealerT && game.dealerCards.length > 0 && `— ${game.dealerRevealed ? dealerT.total : `showing ${dealerT.total}`}`}
        </div>
        <div className="card-row">
          {game.dealerCards.map((c, i) => (
            <CardView key={`${c}-${i}`} card={c} faceDown={i === 1 && !game.dealerRevealed} />
          ))}
        </div>

        {game.hands.map((h, i) => {
          const t = handTotal(h.cards);
          const active = inRound && i === game.activeHand;
          return (
            <div key={i} className={`hand-block ${active ? 'active' : ''}`}>
              <div className="seat-label">
                {game.hands.length > 1 ? `Hand ${i + 1}` : 'Your hand'} — {t.soft && t.total <= 21 ? 'soft ' : ''}
                {t.total}
                {h.doubled && ' (doubled)'} · ${h.bet}
                {h.result && (
                  <span className={`result-badge ${h.result === 'lose' ? 'lose' : h.result === 'push' ? 'push' : 'win'}`}>
                    {h.result === 'blackjack' ? 'Blackjack!' : h.result}
                    {h.payout !== undefined && h.payout !== 0 && ` ${h.payout > 0 ? '+' : '−'}$${Math.abs(h.payout)}`}
                  </span>
                )}
              </div>
              <div className="card-row">
                {h.cards.map((c, j) => (
                  <CardView key={`${c}-${j}`} card={c} />
                ))}
              </div>
            </div>
          );
        })}

        {game.message && <div className="table-msg">{game.message}</div>}

        {inRound ? (
          <div className="action-row">
            {(['hit', 'stand', 'double', 'split'] as BJAction[]).map((a) => (
              <button
                key={a}
                className="btn-action"
                disabled={!actions.includes(a) || (a !== 'stand' && a !== 'hit' && session.state.bankroll < game.hands[game.activeHand].bet)}
                onClick={() => onAction(a)}
              >
                {ACTION_LABELS[a]}
              </button>
            ))}
          </div>
        ) : (
          <>
            <BetControl label="Bet" value={bet} onChange={setBet} />
            <div className="action-row">
              <button className="btn-action primary" onClick={onDeal} disabled={session.state.bankroll < bet}>
                Deal — ${bet}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="side-panel">
        <FeedbackPanel grade={grade} unitLabel="× bet" />
        <EdgePanel
          gameId={GAME}
          impliedEdgePct={impliedEdge}
          unitNote="Edge as % of the initial bet. Implied edge computed from this app's own EV model (infinite-deck, S17, DAS, one split, no surrender)."
        />
      </div>
    </div>
  );
}
