import { useEffect, useMemo, useState } from 'react';
import { BlackjackGame } from './games/BlackjackGame';
import { ThreeCardGame } from './games/ThreeCardGame';
import { UthGame } from './games/UthGame';
import { VideoPokerGame } from './games/VideoPokerGame';
import { houseEdge } from './lib/blackjack/ev';
import { SessionProvider, useSession } from './store/session';

const GAMES = [
  {
    path: 'blackjack',
    icon: '🂡',
    title: 'Blackjack',
    rules: '6 decks · S17 · DAS · 3:2 — hit, stand, double and split your way to perfect basic strategy.',
    edge: () => `${(houseEdge() * 100).toFixed(2)}% edge at perfect play`,
    component: BlackjackGame,
  },
  {
    path: 'videopoker',
    icon: '🎰',
    title: 'Video Poker',
    rules: 'Jacks or Better 9/6, Bonus Poker 8/5, Double Double Bonus 9/6 and full-pay Deuces Wild — up to 10 hands.',
    edge: () => '0.46% edge (9/6 JoB) · Deuces Wild pays 100.76%',
    component: VideoPokerGame,
  },
  {
    path: 'uth',
    icon: '♠️',
    title: "Ultimate Texas Hold'em",
    rules: 'Check or raise 4×, 2×, 1× — the earlier you bet, the bigger the edge you keep.',
    edge: () => '2.19% of ante at optimal play',
    component: UthGame,
  },
  {
    path: 'threecard',
    icon: '🃏',
    title: 'Three Card Poker',
    rules: 'Ante and play — learn why Q-6-4 is the line between playing and folding.',
    edge: () => '3.37% of ante at optimal play',
    component: ThreeCardGame,
  },
];

function useHashRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#\/?/, ''));
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#\/?/, ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

function TopBar() {
  const session = useSession();
  const [amount, setAmount] = useState(500);
  return (
    <header className="topbar">
      <a href="#/" style={{ color: 'inherit' }}>
        <div className="brand">
          Basic Instinct
          <small>casino strategy trainer</small>
        </div>
      </a>
      <div className="spacer" />
      <div className="bankroll-chip">
        <label>Bankroll</label>
        <span className="amount">${session.state.bankroll.toFixed(2).replace(/\.00$/, '')}</span>
      </div>
      <div className="add-funds">
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
        />
        <button className="btn-gold" onClick={() => session.addFunds(amount)}>
          + Add funds
        </button>
      </div>
    </header>
  );
}

function Lobby() {
  const edges = useMemo(() => GAMES.map((g) => g.edge()), []);
  return (
    <div className="lobby">
      <h1>Trust your basic instinct.</h1>
      <p className="tagline">
        Every decision you make at the table gets graded against the actual math — see exactly what your
        mistakes cost, and watch your personal house edge converge on perfect play.
      </p>
      <div className="game-grid">
        {GAMES.map((g, i) => (
          <a key={g.path} className="game-card" href={`#/${g.path}`}>
            <div className="icon">{g.icon}</div>
            <h3>{g.title}</h3>
            <div className="rules">{g.rules}</div>
            <div className="edge-tag">{edges[i]}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Shell() {
  const route = useHashRoute();
  const game = GAMES.find((g) => g.path === route);
  return (
    <>
      <TopBar />
      {game ? (
        <>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 24px 0', width: '100%' }}>
            <a className="back-link" href="#/">
              ← All games
            </a>
          </div>
          <game.component />
        </>
      ) : (
        <Lobby />
      )}
      <footer className="credits">
        Basic Instinct — a casino strategy trainer. Play money only; the only thing at risk is your ego.
      </footer>
    </>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <Shell />
    </SessionProvider>
  );
}
