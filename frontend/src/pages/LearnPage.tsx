import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { actionEVs, bestAction, HandState } from '../lib/blackjack/ev';
import { SITE_NAME } from '../config';

// ---------------------------------------------------------------- glossary

interface GlossaryEntry {
  key: string;
  term: string;
  /** one-sentence popover definition */
  short: string;
  /** fuller glossary-page explanation */
  long: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    key: 'house-edge',
    term: 'House edge',
    short: 'The built-in percentage of every bet the casino keeps over the long run.',
    long: 'The casino\'s built-in mathematical advantage, written as a percentage of your bet. A 1% house edge means that for every $100 you bet, you lose an average of $1 over the long run. You might win big tonight or lose big — the edge is the long-term average, not a per-hand fee. Lower is better for you.',
  },
  {
    key: 'implied-vs-actual',
    term: 'Implied vs. actual edge',
    short: 'Implied = the edge if you play perfectly. Actual = the edge you\'re really giving the casino, mistakes included.',
    long: 'The "implied" (or theoretical) house edge assumes you make the best decision every time. Your "actual" edge adds the cost of your mistakes on top. Example: blackjack\'s implied edge here is about 0.6%, but if you misplay hands, your personal edge might be 2% or worse. This site tracks both so you can watch the gap close as you improve.',
  },
  {
    key: 'odds',
    term: 'Odds',
    short: 'How likely something is to happen, often written as chances against it (e.g. 3-to-1).',
    long: 'A way of expressing probability. "3-to-1 against" means the thing happens 1 time in 4. Casinos also use "odds" for payouts: a bet that "pays 3:1" gives you $3 in winnings for every $1 bet. The house edge exists because the payout odds are always slightly worse than the true odds of winning.',
  },
  {
    key: 'expected-value',
    term: 'Expected value (EV)',
    short: 'The average amount a decision wins or loses if you made it in the same spot forever.',
    long: 'The heart of all casino math. Every choice (hit or stand, bet or fold) has an expected value: the average result over thousands of identical situations. EV of +0.18 on a $10 bet means that choice earns $1.80 on average. The correct play is simply the choice with the highest EV — even when it loses this particular hand.',
  },
  {
    key: 'variance',
    term: 'Variance',
    short: 'The natural short-term swings between what you "should" win and what actually happens.',
    long: 'Even perfect play loses sometimes — variance is the statistical name for those swings. Doubling an 11 against a 6 is right every time, and it still loses 4 hands in 10. Don\'t judge a decision by one result; judge it by the math. Variance is why casinos need you to play a long time, and why one lucky night proves nothing.',
  },
  {
    key: 'bankroll',
    term: 'Bankroll',
    short: 'The pool of money you\'ve set aside to play with.',
    long: 'Your playing budget, kept separate from money you need for real life. On this site the bankroll is pretend, but the habit is real: decide what you\'d bring to the casino, and notice how quickly bad decisions burn through it compared to good ones.',
  },
  {
    key: 'bet-wager',
    term: 'Bet / wager',
    short: 'Money risked on the outcome — the two words mean the same thing.',
    long: '"Bet" and "wager" are interchangeable. Some games have one bet; others (like Ultimate Texas Hold\'em) have several bets working at once, each with its own rules for when it wins and how much it pays.',
  },
  {
    key: 'ante',
    term: 'Ante',
    short: 'The upfront bet you must place before cards are dealt.',
    long: 'In dealer-vs-player poker games (Three Card Poker, Ultimate Texas Hold\'em), the ante is the ticket in: an upfront bet placed before any cards are dealt. You\'ll usually add more bets later if you like your hand — or fold and give up the ante.',
  },
  {
    key: 'blind-bet',
    term: 'Blind (bet)',
    short: 'A second required bet in Ultimate Texas Hold\'em that only pays extra on big hands.',
    long: 'In Ultimate Texas Hold\'em you must place two equal bets to start: an ante and a "blind". The blind is special: even if you beat the dealer, it only pays extra when your final hand is a straight or better; on smaller wins it just gets returned ("pushes"). Think of it as the fee that funds the big bonus payouts.',
  },
  {
    key: 'play-bet',
    term: 'Play bet',
    short: 'The extra bet you make when you decide to stay in the hand instead of folding.',
    long: 'In Three Card Poker and Ultimate Texas Hold\'em, after seeing your cards you either fold or place a "play" bet to challenge the dealer. In UTH its size depends on timing: bet early (knowing less) and you can bet 4× your ante; wait until the end and you can only bet 1×.',
  },
  {
    key: 'push',
    term: 'Push',
    short: 'A tie — your bet is returned, nobody wins.',
    long: 'When a bet pushes, you get that money back with no winnings and no loss. Example: you and the dealer both make 19 in blackjack. Pushes are neutral, and some bets (like the UTH ante when the dealer has a weak hand) push by rule.',
  },
  {
    key: 'qualify',
    term: 'Qualify (dealer)',
    short: 'The minimum hand a dealer needs before some bets are settled at full stakes.',
    long: 'In some poker-style games the dealer needs a minimum hand to "open" or "qualify" — queen-high in Three Card Poker, a pair in Ultimate Texas Hold\'em. If the dealer doesn\'t qualify, part of your bet is returned or paid automatically. This rule is why playing some weak hands is still profitable: sometimes the dealer can\'t even show up to the fight.',
  },
  {
    key: 'paytable',
    term: 'Pay table',
    short: 'The posted list of what each winning hand pays.',
    long: 'The menu of payouts, posted right on the machine or table. Video poker pay tables are named by their key numbers: "9/6 Jacks or Better" pays 9× on a full house and 6× on a flush. Casinos offer identical games with stingier pay tables (8/5, 7/5) side by side — learning to read the pay table is the easiest money in the casino.',
  },
  {
    key: 'return',
    term: 'Return (RTP)',
    short: 'The percentage of all money bet that a game pays back over time — 100% minus the house edge.',
    long: 'Return-to-player is the flip side of house edge. A 99.54% return means the house keeps 0.46%. A return over 100% (like full-pay Deuces Wild at 100.76%) means perfect play actually has a tiny edge over the house — rare, but real.',
  },
  {
    key: 'basic-strategy',
    term: 'Basic strategy',
    short: 'The chart of mathematically best blackjack decisions for every hand vs. every dealer card.',
    long: 'The complete, solved answer to blackjack: for every combination of your hand and the dealer\'s visible card, one action (hit, stand, double, split) has the best expected value. Memorize the chart and you play as well as anyone on earth can without counting cards.',
  },
  {
    key: 'hit-stand',
    term: 'Hit / stand',
    short: 'Hit = take another card. Stand = keep what you have.',
    long: 'The two basic blackjack moves. You can hit as many times as you like until you stand or go over 21 ("bust"). The skill is knowing when your total is strong enough to stop, given what the dealer is showing.',
  },
  {
    key: 'double',
    term: 'Double down',
    short: 'Double your bet in exchange for exactly one more card.',
    long: 'A blackjack option on your first two cards: double your bet, receive exactly one more card, and you\'re done. It\'s how you press your advantage when the dealer looks weak — the catch is you give up the right to hit again.',
  },
  {
    key: 'split',
    term: 'Split',
    short: 'Turn a pair into two separate hands, each with its own bet.',
    long: 'When your first two blackjack cards match (8-8, A-A), you may split them into two hands, adding a second bet equal to your first. Each hand then plays out normally. Splitting rescues terrible totals (16 becomes two 8s) and doubles your money on strong starts (A-A).',
  },
  {
    key: 'upcard',
    term: 'Upcard',
    short: 'The one dealer card you can see in blackjack.',
    long: 'The dealer deals themselves two cards, one face up. That visible card — the upcard — is half of every basic strategy decision. A 2–6 upcard means the dealer busts often (play safe); a 7–A means they\'ll usually finish strong (play aggressively).',
  },
  {
    key: 'bust',
    term: 'Bust',
    short: 'Going over 21 in blackjack — an instant loss.',
    long: 'If your hand passes 21 you bust and lose immediately, even if the dealer would have busted too. That asymmetry — you bust first — is the entire source of the house\'s edge in blackjack.',
  },
  {
    key: 'soft-hand',
    term: 'Soft hand',
    short: 'A blackjack hand with an ace counting as 11 — you can\'t bust by taking one card.',
    long: 'An ace counts as 11 or 1, whichever helps. A hand where it counts as 11 is "soft" (A-7 is soft 18). Hitting a soft hand can never bust you — the ace just drops to 1 — which is why soft hands play far more aggressively than the same "hard" total.',
  },
  {
    key: 'hole-cards',
    term: 'Hole cards',
    short: 'Your two private, face-down cards in hold\'em games.',
    long: 'In Texas Hold\'em-style games your two personal cards are your hole cards. Combined with the five shared "community" cards, the best five of the seven make your hand. "Hidden pair" means one of your hole cards pairs the board — a pair the dealer can\'t also have.',
  },
  {
    key: 'board',
    term: 'Board / community cards',
    short: 'The five shared face-up cards everyone (including the dealer) uses.',
    long: 'In Ultimate Texas Hold\'em, five cards are dealt face up in the middle: three at once (the "flop"), then the last two (the "turn" and "river" — dealt together in UTH). Both you and the dealer combine them with your own two cards. If the board itself is the best hand, you "play the board" and ties are common.',
  },
  {
    key: 'suited',
    term: 'Suited / offsuit',
    short: 'Suited = your two cards share a suit (♠♥♦♣); offsuit = they don\'t.',
    long: 'Two starting cards of the same suit are "suited" — worth slightly more because they can make a flush together. K♥5♥ is "K5 suited" (written K5s); K♥5♣ is "K5 offsuit" (K5o). Preflop strategy charts treat them differently for exactly this reason.',
  },
  {
    key: 'kicker',
    term: 'Kicker',
    short: 'The leftover card that breaks ties between equal hands.',
    long: 'When two hands have the same pair or the same four of a kind, the highest remaining card — the kicker — decides the winner. In Double Double Bonus video poker the kicker takes on a second meaning: a specific 5th card (A, 2, 3 or 4) alongside four of a kind that multiplies the payout.',
  },
  {
    key: 'outs',
    term: 'Outs',
    short: 'The unseen cards that would turn your losing hand into a winner.',
    long: 'A counting tool. If you need a heart for your flush and 9 hearts remain unseen, you have 9 outs. In UTH river strategy it flips around: "dealer outs" are cards that would give the dealer a hand that beats yours — few dealer outs means your weak hand is safer than it looks.',
  },
  {
    key: 'quads-trips',
    term: 'Trips / quads',
    short: 'Poker slang: trips = three of a kind, quads = four of a kind.',
    long: 'Shorthand you\'ll hear at any poker table. Trips (three matching ranks) is a strong hand; quads (all four) is a monster that headlines most bonus pay tables.',
  },
  {
    key: 'wild-card',
    term: 'Wild card',
    short: 'A card that can pretend to be any card you need — in Deuces Wild, every 2 is wild.',
    long: 'A wild card substitutes for whatever makes your hand best. In Deuces Wild video poker all four 2s are wild, which makes even junk hands salvageable — and completely rewrites strategy: a lone deuce is more valuable than almost anything else you could hold with it.',
  },
  {
    key: 'pat-hand',
    term: 'Pat hand / made hand',
    short: 'A hand that\'s already complete and paying — no drawing needed.',
    long: 'Being dealt a flush or straight right off the deal gives you a "pat" (or "made") hand. Usually you keep it — but not always. The classic exception: dealt a flush that\'s one card away from a royal flush, the math says break the flush and chase the royal.',
  },
  {
    key: 'draw',
    term: 'Draw',
    short: 'Exchanging your unwanted cards for new ones in video poker.',
    long: 'Video poker is one decision: which of your five cards to hold. The machine replaces ("draws") the rest from the same shuffled deck. "Four to a flush" means holding four suited cards and drawing one, hoping to complete it.',
  },
  {
    key: 'royal-flush',
    term: 'Royal flush',
    short: 'A-K-Q-J-10 all in one suit — the jackpot hand of video poker.',
    long: 'The best possible poker hand and the jackpot on every video poker pay table, typically paying 800× your bet at max coins. It arrives about once per 40,000 hands of Jacks or Better — rare enough to be special, common enough that strategy genuinely chases it.',
  },
];

const GLOSSARY_MAP = new Map(GLOSSARY.map((g) => [g.key, g]));

const TermSheetCtx = createContext<(entry: GlossaryEntry) => void>(() => {});

/**
 * Inline glossary term: dotted underline with a hover popover; clicking opens a
 * dismissable bottom sheet with the full definition — the reader never leaves the page.
 * The href stays for crawlers and middle-click, but normal clicks are intercepted.
 */
function T({ k, children }: { k: string; children: ReactNode }) {
  const openSheet = useContext(TermSheetCtx);
  const entry = GLOSSARY_MAP.get(k);
  if (!entry) return <>{children}</>;
  return (
    <a
      className="term"
      href={`/learn/glossary#${entry.key}`}
      data-tip={entry.short}
      onClick={(e) => {
        e.preventDefault();
        openSheet(entry);
      }}
    >
      {children}
    </a>
  );
}

function TermSheet({ entry, onClose }: { entry: GlossaryEntry | null; onClose: () => void }) {
  useEffect(() => {
    if (!entry) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [entry, onClose]);

  if (!entry) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="term-sheet" role="dialog" aria-modal="true" aria-label={entry.term} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        <div className="sheet-head">
          <h3>{entry.term}</h3>
          <button className="sheet-close" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <p>{entry.long}</p>
        <a className="sheet-more" href={`/learn/glossary#${entry.key}`} onClick={onClose}>
          Browse the full glossary →
        </a>
      </div>
    </div>
  );
}

function GlossaryLesson() {
  return (
    <>
      <h1>The Glossary</h1>
      <p className="lede">
        Casino language, translated. Anywhere you see a{' '}
        <span className="term" data-tip="Just like this — hover or tap dotted words anywhere in the Strategy School.">
          dotted word
        </span>{' '}
        in the Strategy School you can hover (or tap) for a quick definition, or come here for the full story.
      </p>
      <dl className="glossary-list">
        {GLOSSARY.map((g) => (
          <div key={g.key} id={g.key} className="glossary-entry">
            <dt>{g.term}</dt>
            <dd>{g.long}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

// ---------------------------------------------------------------- blackjack charts

const DEALER_UPS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const UP_LABELS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

type Cell = 'H' | 'S' | 'D' | 'Ds' | 'P';

function decide(state: HandState, up: number): Cell {
  const evs = actionEVs(state, up);
  const best = bestAction(evs);
  if (best === 'split') return 'P';
  if (best === 'double') return evs.stand! > evs.hit! ? 'Ds' : 'D';
  return best === 'hit' ? 'H' : 'S';
}

function useBlackjackCharts() {
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

function StratChart({ rows, caption }: { rows: { label: string; cells: Cell[] }[]; caption: string }) {
  return (
    <div className="table-scroll">
      <table className="strat-table">
        <caption style={{ captionSide: 'bottom', fontSize: 11, color: 'var(--text-dim)', paddingTop: 6 }}>
          {caption}
        </caption>
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

function Legend() {
  return (
    <div className="strat-legend">
      <span><span className="key" style={{ background: 'rgba(224,87,79,.28)' }} />H = Hit (take a card)</span>
      <span><span className="key" style={{ background: 'rgba(76,186,119,.26)' }} />S = Stand (stop)</span>
      <span><span className="key" style={{ background: 'rgba(88,146,227,.3)' }} />D = Double (else hit) · Ds = Double (else stand)</span>
      <span><span className="key" style={{ background: 'rgba(217,171,74,.32)' }} />P = Split the pair</span>
    </div>
  );
}

// ---------------------------------------------------------------- lessons

function BlackjackLesson() {
  const charts = useBlackjackCharts();
  return (
    <>
      <h1>Blackjack Basic Strategy</h1>
      <p className="lede">
        The goal of blackjack is simple: get closer to 21 than the dealer without going over (
        <T k="bust">busting</T>). After the deal you choose to <T k="hit-stand">hit or stand</T>, and sometimes to{' '}
        <T k="double">double down</T> or <T k="split">split</T>. Here&#39;s the good news: blackjack is a solved
        game. For every hand you can hold and every dealer <T k="upcard">upcard</T>, one choice is mathematically
        best — the complete answer is called <T k="basic-strategy">basic strategy</T>, and it fits on a chart.
      </p>
      <p className="lede">
        The charts below are <strong>generated by this site&#39;s own math engine</strong> — the same one that
        grades you at the table (6 decks, dealer stands on all 17s, double after split allowed, no surrender) — so
        what you study here is exactly what the trainer expects.
      </p>
      <h2>How to read the charts</h2>
      <p>
        Find your hand on the left, the dealer&#39;s upcard along the top, and do what the letter says. One idea
        explains most of the chart: <strong>a dealer showing 2–6 busts often</strong> (they must keep taking cards
        until 17), so you play conservatively and let them destroy themselves; <strong>a dealer showing 7–A
        usually finishes strong</strong>, so you take more risks to catch up.
      </p>
      <Legend />
      <h3>Hard totals (no ace, or the ace forced to count as 1)</h3>
      <StratChart rows={charts.hard} caption="Hard 8 and below: always hit. Hard 18 and up: always stand." />
      <h3>Soft totals (an ace counting as 11)</h3>
      <p>
        A <T k="soft-hand">soft hand</T> can&#39;t bust by taking one card — the ace just switches from 11 to 1 —
        so these hands play far more aggressively than the same number without an ace.
      </p>
      <StratChart rows={charts.soft} caption="Soft 21 is just 21 — stand." />
      <h3>Pairs</h3>
      <StratChart rows={charts.pairs} caption="P = split. Where there's no P, play the hand as its total." />
      <h2>The five rules people break most</h2>
      <ol>
        <li><strong>Always split aces and eights.</strong> Even against a 10 or ace. 16 is the worst total in the game — splitting turns it into two fresh hands.</li>
        <li><strong>Never split tens or fives.</strong> 20 already wins most hands; a pair of fives is just a 10 that would rather <T k="double">double</T>.</li>
        <li><strong>Double 11 against everything</strong> (under these rules), and 10 against everything except a dealer 10 or ace.</li>
        <li><strong>Hit soft 18 against 9, 10 or ace.</strong> A-7 feels safe, but standing on it against big cards loses money long-term. Against 3–6, double it.</li>
        <li><strong>Hit 12 against a dealer 2 or 3.</strong> Only start standing on 12 when the dealer shows 4, 5 or 6.</li>
      </ol>
      <p>
        Why bother? Played perfectly, blackjack&#39;s <T k="house-edge">house edge</T> is about half a percent —
        the best deal in the casino. Played by feel, most people give the house 2% or more. Same table, same cards:
        the difference is entirely in the decisions.
      </p>
      <a className="practice-cta" href="/blackjack">Practice blackjack →</a>
    </>
  );
}

function VideoPokerLesson() {
  return (
    <>
      <h1>Video Poker Strategy</h1>
      <p className="lede">
        Video poker deals you five cards. You choose which to keep, and the machine <T k="draw">draws</T>{' '}
        replacements for the rest — one decision per hand, then the <T k="paytable">pay table</T> settles up.
        Unlike slots, everything is knowable: the odds come from a real 52-card deck and the payouts are posted on
        the glass. That makes video poker one of the few casino games where studying actually changes your{' '}
        <T k="return">return</T>.
      </p>
      <p className="lede">
        Each list below is a ladder of priorities: <strong>start at the top and stop at the first line that
        matches your hand — hold those cards and draw the rest.</strong>
      </p>

      <h2>Jacks or Better (9/6) — 99.54% return</h2>
      <p>
        The granddaddy. You win with a pair of jacks or better. &quot;9/6&quot; describes the pay table: full house
        pays 9×, flush pays 6× — always check for those two numbers, because the same game with an 8/5 table keeps
        an extra 1.2% of your money.
      </p>
      <ol>
        <li><T k="royal-flush">Royal flush</T>, straight flush, four of a kind — keep the whole hand</li>
        <li>Four to a royal flush (yes — even if it means breaking up a <T k="pat-hand">made</T> flush or straight)</li>
        <li>Full house, flush, straight, three of a kind</li>
        <li>Four to a straight flush</li>
        <li>Two pair</li>
        <li>High pair (jacks, queens, kings or aces)</li>
        <li>Three to a royal flush</li>
        <li>Four to a flush</li>
        <li>Low pair (10s or worse)</li>
        <li>Four to an open-ended straight (like 6-7-8-9, which any 5 or 10 completes)</li>
        <li>Two <T k="suited">suited</T> high cards</li>
        <li>Three to a straight flush</li>
        <li>Two unsuited high cards (holding three or more? keep just the lowest two)</li>
        <li>Suited 10-J, 10-Q or 10-K</li>
        <li>One high card (J, Q, K or A)</li>
        <li>Nothing — throw all five away</li>
      </ol>
      <p>
        The two most-missed lines: <strong>a low pair beats one or two lone high cards</strong> (line 9 beats 11
        and 13), and <strong>four to a flush beats a low pair</strong> — but a high pair beats them both.
      </p>

      <h2>Bonus Poker (8/5) — 99.17% return</h2>
      <p>
        Same game, one twist: four of a kind pays bonuses by rank (four aces 80×, four 2s–4s 40×), paid for with a
        smaller full house and flush. <strong>Play the Jacks or Better list above</strong> — the right play only
        differs in rare corners, and the trainer will flag those when they come up.
      </p>

      <h2>Double Double Bonus (9/6) — 98.98% return</h2>
      <p>
        Here the quad-chasing gets serious: four aces with a 2, 3 or 4 as the fifth card (the{' '}
        <T k="kicker">kicker</T>) pays a monster 400×. That changes real decisions:
      </p>
      <ol>
        <li><strong>Dealt three aces plus a 2/3/4? Hold all four cards</strong> — that little kicker is worth real money</li>
        <li>Four 2s–4s with an A–4 kicker: keep everything; with any other fifth card, keep just the four of a kind and draw for a premium kicker</li>
        <li><strong>Two pair where one pair is aces: keep only the aces.</strong> In Jacks or Better you&#39;d keep both pairs — here two pair pays a measly 1×, so the shot at four aces wins</li>
        <li>Everything else: play the Jacks or Better list</li>
      </ol>
      <p>The trade-off: bigger jackpots, more dry spells. Expect wilder swings (<T k="variance">variance</T>) than Jacks or Better.</p>

      <h2>Deuces Wild (full pay) — 100.76% return</h2>
      <p>
        All four 2s are <T k="wild-card">wild</T> — a 2 becomes whatever card helps most. Winning starts at three
        of a kind, and with perfect play the full-pay version returns <em>more than 100%</em>: the player has the
        edge. Strategy is organized by how many deuces you&#39;re dealt — <strong>the deuces themselves are almost
        always the most valuable thing in your hand:</strong>
      </p>
      <h3>Dealt four deuces</h3>
      <ol><li>Hold all four (200×). The fifth card is irrelevant</li></ol>
      <h3>Three deuces</h3>
      <ol>
        <li>Keep a made wild royal flush or five of a kind</li>
        <li>Otherwise hold <strong>just the three deuces</strong> and draw two</li>
      </ol>
      <h3>Two deuces</h3>
      <ol>
        <li>Keep any made four of a kind or better</li>
        <li>Keep four to a royal flush</li>
        <li>Otherwise hold <strong>just the two deuces</strong> — never keep a pair with them</li>
      </ol>
      <h3>One deuce</h3>
      <ol>
        <li>Keep any made three of a kind or better (deuce + a pair <em>is</em> three of a kind)</li>
        <li>Four to a royal; four to a straight flush</li>
        <li>Three to a royal; three to a straight flush with both natural cards 6-7 or higher</li>
        <li>Otherwise hold <strong>the deuce alone</strong> and draw four</li>
      </ol>
      <h3>No deuces</h3>
      <ol>
        <li>Keep made hands of three of a kind or better</li>
        <li>Four to a royal or straight flush</li>
        <li>One pair — and <strong>if you have two pair, keep only one of them</strong> (two pair pays nothing here)</li>
        <li>Four to a flush or open-ended straight; three to a royal or straight flush</li>
        <li>Nothing — draw five. Lone high cards are worthless in this game: there&#39;s no jacks-or-better payout to chase</li>
      </ol>
      <a className="practice-cta" href="/videopoker">Practice video poker →</a>
    </>
  );
}

function UthLesson() {
  return (
    <>
      <h1>Ultimate Texas Hold&#39;em Strategy</h1>
      <p className="lede">
        You and the dealer each get two private <T k="hole-cards">hole cards</T>, share five{' '}
        <T k="board">community cards</T>, and the best five-card hand wins. To start you place two equal bets: an{' '}
        <T k="ante">ante</T> and a <T k="blind-bet">blind</T>. Then, at three points in the hand, you get one
        chance to add a <T k="play-bet">play bet</T> — and here&#39;s the twist that defines the whole game:{' '}
        <strong>the earlier you commit, the more you&#39;re allowed to bet.</strong> Before the flop you may bet
        4× your ante; after the flop only 2×; at the end just 1× — or fold and forfeit everything.
      </p>
      <p className="lede">
        So optimal play is aggressive: betting big early with any real advantage is exactly what the math rewards.
        Checking a strong hand &quot;to see what happens&quot; is the single most expensive habit in this game.
      </p>
      <h2>Decision 1 — Preflop: bet 4× or check</h2>
      <p>Looking only at your two cards, bet the full 4× (never less) with:</p>
      <ol>
        <li><strong>Any pair of 3s or better</strong> (a pair of 2s just checks)</li>
        <li><strong>Any hand containing an ace</strong></li>
        <li><strong>King-anything <T k="suited">suited</T></strong>; king + 5 or better offsuit</li>
        <li><strong>Queen + 6 or better suited</strong>; queen + 8 or better offsuit</li>
        <li><strong>Jack + 8 or better suited</strong>; jack + 10 offsuit</li>
      </ol>
      <p>
        Everything else checks. You&#39;ll raise about 38% of hands — if that feels reckless, you&#39;re doing it
        right. An ace-anything really is a favorite over a random dealer hand.
      </p>
      <h2>Decision 2 — After the flop: bet 2× or check</h2>
      <p>Three community cards are up. If you checked before, bet 2× now with:</p>
      <ol>
        <li><strong>Two pair or better</strong></li>
        <li><strong>A hidden pair</strong> — one of <em>your</em> cards pairs the board, or you hold a pocket pair (except 2s). Hidden matters: if the pair sits entirely on the board, the dealer has it too</li>
        <li><strong>Four to a flush</strong> when one of your suited cards is a 10 or higher</li>
      </ol>
      <h2>Decision 3 — The river: bet 1× or fold</h2>
      <p>All five community cards are up. Now it&#39;s bet 1× or surrender your ante and blind:</p>
      <ol>
        <li><strong>Any hidden pair or better — bet.</strong></li>
        <li>
          With nothing, count <T k="outs">dealer outs</T>: unseen cards that would give the dealer a pair that
          beats you. Fewer than 21 (of 45 unseen) — bet; otherwise fold. Rule of thumb: if the board itself is
          decent and your high cards compete, a 1× bet often loses less than folding, because ties{' '}
          <T k="push">push</T> and the dealer frequently fails to <T k="qualify">qualify</T>
        </li>
      </ol>
      <p>
        Folding always costs exactly 2 antes. The trainer computes the exact value of both choices on every river
        (all 990 possible dealer hands), so drill until that boundary is instinct.
      </p>
      <h2>Why the blind bet exists</h2>
      <p>
        The <T k="blind-bet">blind</T> only pays extra when you win with a straight or better — on ordinary wins it
        just pushes. It&#39;s effectively the house&#39;s fee, and big early play bets are how you offset it.
        Played optimally, the game keeps about 2.2% of one ante per hand (about 0.5% of all money you put in play —
        one of the better bets in the casino).
      </p>
      <a className="practice-cta" href="/uth">Practice Ultimate Texas Hold&#39;em →</a>
    </>
  );
}

function ThreeCardLesson() {
  return (
    <>
      <h1>Three Card Poker Strategy</h1>
      <p className="lede">
        The simplest dealer-vs-player poker game: place an <T k="ante">ante</T>, get three cards, then make the
        game&#39;s only decision — fold (give up the ante) or place a <T k="play-bet">play bet</T> equal to your
        ante and show down against the dealer. The entire optimal strategy is one sentence:{' '}
        <strong>play with queen-6-4 or better, fold anything worse.</strong>
      </p>
      <h2>How to read &quot;Q-6-4&quot;</h2>
      <p>
        Compare your three cards to queen-6-4, highest card first. Any pair or better always plays. Q-7-2 plays
        (your second card, 7, beats the 6 before the third card even matters). Q-6-4 exactly plays. Q-6-3 folds.
        J-10-9 folds — any hand without at least a queen is an automatic fold, no matter how pretty it looks.
      </p>
      <h2>Why does such a weak hand play?</h2>
      <p>
        Because of the <T k="qualify">qualification</T> rule: the dealer needs queen-high or better to
        &quot;open&quot;. When the dealer fails to qualify, your ante gets paid <em>even if your hand is
        garbage</em>, and the play bet is returned. Roughly 30% of dealer hands don&#39;t qualify — those free wins
        make marginal hands like Q-6-4 profitable. Playing every hand hands the house about 7.7%; the Q-6-4 line
        holds it to 3.4% of the ante.
      </p>
      <h2>The ante bonus is free money</h2>
      <p>
        Land a straight or better and the ante pays a bonus (straight 1×, <T k="quads-trips">trips</T> 4×, straight
        flush 5×) <strong>even when the dealer beats you</strong>. No decision needed — it&#39;s automatic, and
        it&#39;s why the game plays friendlier than its <T k="house-edge">house edge</T> suggests when the cards
        run hot.
      </p>
      <a className="practice-cta" href="/threecard">Practice Three Card Poker →</a>
    </>
  );
}

function LearnIndex() {
  return (
    <>
      <h1>The Strategy School</h1>
      <p className="lede">
        Never set foot in a casino? Start here. Every game on this site has a mathematically correct way to play
        it — worked out decades ago, checkable to the decimal. Study the lesson, then take it to the table: the
        trainer grades every decision against the same math and shows what each mistake costs. Dotted words like{' '}
        <T k="house-edge">house edge</T> have hover definitions, and the full <a href="/learn/glossary">glossary</a>{' '}
        translates all the casino jargon.
      </p>

      <h2>Casino 101: the house always wins — slowly</h2>
      <p>
        Every casino game pays winners slightly less than the true <T k="odds">odds</T> would suggest. That gap is
        the <T k="house-edge">house edge</T>: the percentage of each <T k="bet-wager">bet</T> the casino keeps on
        average. It&#39;s small — often 1–3% — which is why you can absolutely win on any given night. But it never
        sleeps, and over thousands of bets it grinds. You can&#39;t eliminate it (short of counting cards); what
        you <em>can</em> control is how big it is.
      </p>
      <h2>Your decisions change the price</h2>
      <p>
        In slots, craps or baccarat, once the bet is down there&#39;s nothing left to decide — the edge is fixed.
        The games on this site are different: <strong>you make choices after the cards come out, and every choice
        moves the edge.</strong> The advertised number (the <T k="implied-vs-actual">implied edge</T>) assumes
        perfect play. Play by gut feel and your <em>actual</em> edge can easily be three or four times worse — a
        tax made entirely of avoidable mistakes. This site shows both numbers side by side, live, as you play.
      </p>
      <h2>Expected value: the only math you need</h2>
      <p>
        Every option — hit or stand, hold or draw, bet or fold — has an{' '}
        <T k="expected-value">expected value (EV)</T>: what it would win or lose <em>on average</em> if you made
        that same choice in that same spot forever. The right play is simply the option with the highest EV.
        It will still lose plenty of individual hands — that&#39;s <T k="variance">variance</T>, and it&#39;s
        normal. Judge your decisions by the math, not by one result: doubling 11 against a 6 is correct every
        single time, including the times it loses.
      </p>
      <h2>Where to start</h2>
      <p>
        Blackjack is the classic first study — one chart covers everything. Video poker rewards it most per hour
        of study. If you like the poker pits, Ultimate Texas Hold&#39;em has the most interesting decisions, and
        Three Card Poker takes five minutes to master, literally.
      </p>
    </>
  );
}

// ---------------------------------------------------------------- page

const TOPICS: Record<string, { component: () => JSX.Element; title: string; description: string; nav: string }> = {
  '': {
    component: LearnIndex,
    title: `Casino Strategy School — Learn Perfect Play | ${SITE_NAME}`,
    description:
      'New to casino games? Learn what house edge and expected value actually mean, then study optimal strategy for blackjack, video poker, Ultimate Texas Hold\'em and Three Card Poker.',
    nav: 'Start Here',
  },
  blackjack: {
    component: BlackjackLesson,
    title: `Blackjack Basic Strategy Chart (6-Deck, S17) | ${SITE_NAME}`,
    description:
      'Beginner-friendly blackjack basic strategy: how to read the chart, hard totals, soft totals and pairs — generated by the same EV engine that grades your practice hands.',
    nav: 'Blackjack',
  },
  videopoker: {
    component: VideoPokerLesson,
    title: `Video Poker Strategy — JoB 9/6, Bonus, DDB, Deuces Wild | ${SITE_NAME}`,
    description:
      'Plain-English hold-priority strategy for Jacks or Better 9/6, Bonus Poker 8/5, Double Double Bonus and full-pay Deuces Wild video poker.',
    nav: 'Video Poker',
  },
  uth: {
    component: UthLesson,
    title: `Ultimate Texas Hold'em Strategy — 4x Preflop Chart & River Rule | ${SITE_NAME}`,
    description:
      "Ultimate Texas Hold'em explained for beginners: how the ante, blind and play bets work, when to bet 4x, 2x, 1x and when to fold.",
    nav: "Ultimate Hold'em",
  },
  threecard: {
    component: ThreeCardLesson,
    title: `Three Card Poker Strategy — The Q-6-4 Rule | ${SITE_NAME}`,
    description:
      'Three Card Poker for beginners: how ante, play and the dealer qualification rule work, and why Queen-6-4 is the exact line between playing and folding.',
    nav: 'Three Card',
  },
  glossary: {
    component: GlossaryLesson,
    title: `Casino Terms Glossary — House Edge, EV, Odds Explained | ${SITE_NAME}`,
    description:
      'Plain-English definitions of casino terms: house edge, expected value, odds, variance, ante, blind, pay table, kicker, outs and more.',
    nav: 'Glossary',
  },
};

export function LearnPage({ topic }: { topic: string }) {
  const entry = TOPICS[topic] ?? TOPICS[''];
  const [sheetEntry, setSheetEntry] = useState<GlossaryEntry | null>(null);
  useEffect(() => {
    document.title = entry.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', entry.description);
    // support deep links to glossary anchors after SPA navigation
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView();
    }
  }, [entry]);
  const Body = entry.component;
  return (
    <TermSheetCtx.Provider value={setSheetEntry}>
      <div className="learn-page">
        <nav className="learn-nav">
          {Object.entries(TOPICS).map(([key, t]) => (
            <a key={key} href={key ? `/learn/${key}` : '/learn'} className={entry === t ? 'active' : ''}>
              {t.nav}
            </a>
          ))}
        </nav>
        <Body />
      </div>
      <TermSheet entry={sheetEntry} onClose={() => setSheetEntry(null)} />
    </TermSheetCtx.Provider>
  );
}
