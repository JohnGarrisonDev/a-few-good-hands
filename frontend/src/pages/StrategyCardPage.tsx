import { useEffect, useState } from 'react';
import { Legend, StratChart, useBlackjackCharts } from '../components/BlackjackCharts';
import { SITE_NAME, SITE_URL } from '../config';

/**
 * Quick-reference blackjack basic strategy card. Deliberately minimal — no
 * site chrome, one tap target per chart — so it loads fast and reads at a
 * glance on a phone at a live table. Charts come from the same EV engine
 * that grades the trainer (infinite-deck model; S17, DAS, 3:2).
 */
export function StrategyCardPage() {
  const charts = useBlackjackCharts();
  const [tab, setTab] = useState<'all' | 'hard' | 'soft' | 'pairs'>('all');

  useEffect(() => {
    document.title = `Blackjack Strategy Card — Quick Reference | ${SITE_NAME}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Free pocket blackjack basic strategy card for shoe games (dealer stands on 17, double after split). Hard totals, soft totals and pairs — made to pull up on your phone at the table.',
      );
    }
  }, []);

  const show = (s: 'hard' | 'soft' | 'pairs') => tab === 'all' || tab === s;

  return (
    <div className="strategy-card">
      <header className="card-head">
        <a href="/" className="card-brand">{SITE_NAME}</a>
        <h1>Blackjack Strategy Card</h1>
        <p className="card-rules">Shoe game · dealer stands on all 17s · double after split · no surrender · 3:2</p>
      </header>

      <Legend compact />

      <nav className="card-tabs" aria-label="Chart sections">
        {(['all', 'hard', 'soft', 'pairs'] as const).map((t) => (
          <button key={t} className={tab === t ? 'active' : ''} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t === 'all' ? 'All' : t === 'hard' ? 'Hard' : t === 'soft' ? 'Soft' : 'Pairs'}
          </button>
        ))}
      </nav>

      {show('hard') && (
        <section>
          <h2>Hard totals</h2>
          <StratChart rows={charts.hard} caption="7 or less: always hit. 18+: always stand." />
        </section>
      )}
      {show('soft') && (
        <section>
          <h2>Soft totals (ace = 11)</h2>
          <StratChart rows={charts.soft} caption="Soft 21 is 21 — stand." />
        </section>
      )}
      {show('pairs') && (
        <section>
          <h2>Pairs</h2>
          <StratChart rows={charts.pairs} caption="No P? Play the hand as its total." />
        </section>
      )}

      <footer className="card-foot">
        <p>
          Read: your hand (left) vs. dealer upcard (top). Charts computed live by the {SITE_NAME} EV engine
          (infinite-deck model — matches the published six-deck chart except A,2 vs 5 and A,4 vs 4, where six
          decks double and the difference is under a hundredth of a bet) —{' '}
          <a href="/learn/blackjack">full lesson</a> · <a href="/blackjack">practice trainer</a>
        </p>
        <p className="card-url">{SITE_URL.replace('https://', '')}/card</p>
      </footer>
    </div>
  );
}
