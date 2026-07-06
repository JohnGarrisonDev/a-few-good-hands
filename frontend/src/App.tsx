import { useEffect, useMemo, useState } from 'react';
import { AdSlot } from './components/AdSlot';
import { IconBlackjack, IconSpade, IconTripleCards, IconVideoPoker, Logo } from './components/icons';
import { BlackjackGame } from './games/BlackjackGame';
import { ThreeCardGame } from './games/ThreeCardGame';
import { UthGame } from './games/UthGame';
import { VideoPokerGame } from './games/VideoPokerGame';
import { houseEdge } from './lib/blackjack/ev';
import { LearnPage } from './pages/LearnPage';
import { LegalPage } from './pages/LegalPage';
import { SessionProvider, useSession } from './store/session';
import { COPYRIGHT_OWNER, COPYRIGHT_YEAR, SITE_NAME } from './config';

const GAMES = [
  {
    path: 'blackjack',
    icon: <IconBlackjack />,
    title: 'Blackjack',
    seoTitle: 'Blackjack Basic Strategy Trainer — Free, Every Decision Graded',
    description:
      'Practice blackjack basic strategy free: hit, stand, double and split decisions graded against exact expected values for 6-deck S17 DAS rules.',
    rules: '6 decks · S17 · DAS · 3:2 — hit, stand, double and split your way to perfect basic strategy.',
    edge: () => `${(houseEdge() * 100).toFixed(2)}% edge at perfect play`,
    component: BlackjackGame,
  },
  {
    path: 'videopoker',
    icon: <IconVideoPoker />,
    title: 'Video Poker',
    seoTitle: 'Video Poker Trainer — Jacks or Better, Bonus, Deuces Wild (Exact EV)',
    description:
      'Free video poker trainer with exact hold analysis: Jacks or Better 9/6, Bonus Poker 8/5, Double Double Bonus 9/6 and full-pay Deuces Wild, up to 10 hands.',
    rules: 'Jacks or Better 9/6, Bonus Poker 8/5, Double Double Bonus 9/6 and full-pay Deuces Wild — up to 10 hands.',
    edge: () => '0.46% edge (9/6 JoB) · Deuces Wild pays 100.76%',
    component: VideoPokerGame,
  },
  {
    path: 'uth',
    icon: <IconSpade />,
    title: "Ultimate Texas Hold'em",
    seoTitle: "Ultimate Texas Hold'em Strategy Trainer — 4x, 2x, 1x Decisions Graded",
    description:
      "Practice Ultimate Texas Hold'em strategy free: preflop 4x chart, exact flop and river analysis, and see the EV cost of every mistake.",
    rules: 'Check or raise 4×, 2×, 1× — the earlier you bet, the bigger the edge you keep.',
    edge: () => '2.19% of ante at optimal play',
    component: UthGame,
  },
  {
    path: 'threecard',
    icon: <IconTripleCards />,
    title: 'Three Card Poker',
    seoTitle: 'Three Card Poker Strategy Trainer — Learn the Q-6-4 Rule',
    description:
      'Free Three Card Poker trainer: play-or-fold decisions graded by exact enumeration of all dealer hands. Learn why Q-6-4 is the line.',
    rules: 'Ante and play — learn why Q-6-4 is the line between playing and folding.',
    edge: () => '3.37% of ante at optimal play',
    component: ThreeCardGame,
  },
];

function currentPath(): string {
  return window.location.pathname.replace(/^\/+|\/+$/g, '');
}

function usePathRoute(): string {
  const [route, setRoute] = useState(currentPath);
  useEffect(() => {
    const onPop = () => setRoute(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.origin !== window.location.origin) return;
      e.preventDefault();
      if (a.pathname !== window.location.pathname) {
        window.history.pushState(null, '', a.pathname);
        setRoute(a.pathname.replace(/^\/+|\/+$/g, ''));
        window.scrollTo(0, 0);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return route;
}

function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [title, description]);
}

function TopBar() {
  const session = useSession();
  const [amount, setAmount] = useState(500);
  return (
    <header className="topbar">
      <a href="/" className="brand">
        <Logo />
        <span className="wordmark">
          A Few Good <em>Hands</em>
          <small>casino strategy trainer</small>
        </span>
      </a>
      <nav className="site-nav">
        <a href="/">Play</a>
        <a href="/learn">Learn</a>
      </nav>
      <div className="spacer" />
      <button
        className="anim-toggle"
        title={session.state.animations ? 'Turn animations off' : 'Turn animations on'}
        aria-pressed={session.state.animations}
        onClick={() => session.toggleAnimations()}
      >
        <span className="track">
          <span className="knob" />
        </span>
        <span className="label-text">Motion</span>
      </button>
      <div className="bankroll-chip">
        <label>Bankroll</label>
        <span className="amount" key={session.state.bankroll}>
          ${session.state.bankroll.toFixed(2).replace(/\.00$/, '')}
        </span>
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
  useSeo(
    `${SITE_NAME} — Free Casino Strategy Trainer | Blackjack, Video Poker, Ultimate Texas Hold'em`,
    'Free casino strategy trainer. Every blackjack, video poker, Ultimate Texas Hold\'em and Three Card Poker decision graded against the real math. No real money, ever.',
  );
  return (
    <div className="lobby">
      <h1>You want the truth about your play?</h1>
      <p className="tagline">
        Every decision you make at the table gets graded against the actual math — see exactly what your mistakes
        cost in expected value, and watch your personal house edge converge on perfect play. Free, play-money
        only. New to a game? <a href="/learn">Study the strategy first</a>.
      </p>
      <div className="game-grid">
        {GAMES.map((g, i) => (
          <a key={g.path} className="game-card" href={`/${g.path}`}>
            <div className="icon">{g.icon}</div>
            <h3>{g.title}</h3>
            <div className="rules">{g.rules}</div>
            <div className="edge-tag">{edges[i]}</div>
          </a>
        ))}
      </div>

      <AdSlot placement="lobby" />

      <div className="suit-rule">♠ ♥ ♦ ♣</div>

      <section className="seo-copy">
        <h2>Why train the decisions?</h2>
        <p>
          Casino games are not all created equal. In games like slots, craps or baccarat, once your bet is down
          the math is out of your hands. But in <a href="/blackjack">blackjack</a>,{' '}
          <a href="/videopoker">video poker</a>, <a href="/uth">Ultimate Texas Hold&#39;em</a> and{' '}
          <a href="/threecard">Three Card Poker</a>, <em>you</em> make decisions after the deal — and every one of
          them moves the house edge. Play perfectly and 9/6 Jacks or Better gives the house just 0.46%; full-pay
          Deuces Wild actually pays back more than 100%. Play badly and you can hand the casino five, ten, twenty
          times the edge the sign advertises.
        </p>
        <h2>How the grading works</h2>
        <p>
          This trainer doesn&#39;t just tell you the &quot;book&quot; play — it computes the expected value of
          every option you had. Video poker holds are graded by exhaustively evaluating all 32 ways to hold your
          cards against every possible draw. Ultimate Texas Hold&#39;em river and flop decisions enumerate every
          dealer hand exactly. Blackjack decisions come from a full expected-value engine. When you make a mistake,
          you see its cost in dollars and cents, and your session&#39;s <strong>actual house edge</strong> updates
          so you can watch it converge toward the theoretical minimum as your play improves. Want the theory first?
          The <a href="/learn">Strategy School</a> has charts and hold lists for every game here.
        </p>
        <h2>Free means free</h2>
        <p>
          No real-money gambling, no deposits, no prizes, no sign-up. Your play-money bankroll and stats live in
          your own browser. Intended for adults of legal gambling age who want to walk into a casino knowing
          exactly what the right play is — and what the wrong one costs.
        </p>
      </section>
    </div>
  );
}

function Shell() {
  const route = usePathRoute();
  const session = useSession();
  const game = GAMES.find((g) => g.path === route);
  const isLegal = route === 'legal';
  const isLearn = route === 'learn' || route.startsWith('learn/');
  const learnTopic = route.startsWith('learn/') ? route.slice(6) : '';

  useEffect(() => {
    document.body.classList.toggle('reduced-motion', !session.state.animations);
  }, [session.state.animations]);

  useEffect(() => {
    if (game) {
      document.title = `${game.seoTitle} | ${SITE_NAME}`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', game.description);
    }
  }, [game]);

  return (
    <>
      <TopBar />
      {game ? (
        <>
          <div className="crumb-row" style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 24px 0', width: '100%' }}>
            <a href="/">← All games</a>
            <a href={`/learn/${game.path}`}>Study this game&#39;s strategy →</a>
          </div>
          <game.component />
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', width: '100%' }}>
            <AdSlot placement="sidebar" />
          </div>
        </>
      ) : isLearn ? (
        <LearnPage topic={learnTopic} />
      ) : isLegal ? (
        <LegalPage />
      ) : (
        <Lobby />
      )}
      <footer className="credits">
        <div>
          © {COPYRIGHT_YEAR} {COPYRIGHT_OWNER}. All rights reserved. · <a href="/learn">Strategy School</a> ·{' '}
          <a href="/legal">Legal, Privacy &amp; Disclaimers</a>
        </div>
        <div className="fine-print">
          Free educational strategy trainer. Play money only — no real-money gambling, no prizes of any value. For
          adults of legal gambling age. &quot;Ultimate Texas Hold&#39;em&quot; and &quot;Three Card Poker&quot; are
          trademarks of their respective owners; this site is not affiliated with any casino or game manufacturer.
          Problem gambling? Call 1-800-GAMBLER.
        </div>
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
