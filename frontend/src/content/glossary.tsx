import { ReactNode, createContext, useContext, useEffect } from 'react';

// Glossary data plus the inline <T> term component and its bottom sheet.
// Shared by the Strategy School lessons and the standalone articles.

export interface GlossaryEntry {
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
  {
    key: 'rng',
    term: 'RNG (random number generator)',
    short: 'The chip that decides every slot result the instant you press spin — the reels are just animation.',
    long: 'Every modern slot machine runs a random number generator: software that produces thousands of numbers per second, around the clock. The moment you press spin, the current number decides the outcome; the spinning reels, near misses and celebrations that follow are a show, replaying a decision already made. Because the RNG never stops and has no memory, every spin is independent — a machine is never "due," "hot" or "cold."',
  },
  {
    key: 'hit-frequency',
    term: 'Hit frequency',
    short: 'How often a slot lands any win at all — separate from how much it pays back.',
    long: 'The percentage of spins that return something. A 25% hit frequency means roughly one spin in four pays — though on multi-line slots many "wins" are smaller than the bet that produced them. Hit frequency and return are independent: two machines can both pay back 94% while one pays little and often and the other pays rarely and big. That difference is volatility.',
  },
  {
    key: 'volatility',
    term: 'Volatility (slots)',
    short: 'How a slot distributes its payback: many small wins (low) or rare big ones (high).',
    long: 'Slot-world jargon for variance. A low-volatility machine pays small amounts frequently — your bankroll erodes slowly and smoothly. A high-volatility machine funnels its payback into rare, large hits — long dry spells punctuated by big wins. Same average return, wildly different rides. Matching a machine\'s volatility to your bankroll and temperament is the single most useful slot skill.',
  },
  {
    key: 'progressive',
    term: 'Progressive jackpot',
    short: 'A jackpot that grows as people play, funded by a slice of every bet.',
    long: 'A jackpot meter that climbs as money is wagered, because a small percentage of each bet feeds it. Standalone progressives build from one machine; local progressives link machines in one casino; wide-area progressives link machines across many casinos into life-changing (and lottery-rare) prizes. The bigger the network, the bigger the jackpot — and the smaller your odds of being the one who hits it.',
  },
  {
    key: 'must-hit-by',
    term: 'Must-hit-by',
    short: 'A progressive that is guaranteed to pay before its meter reaches a printed ceiling.',
    long: 'Some progressives display a cap — "must hit by $500" — and are guaranteed to pay out before the meter reaches it. Unlike ordinary progressives, that guarantee creates a rare sliver of real math for slot players: the closer the meter sits to its ceiling, the better the bet becomes, and a meter close enough to the cap can briefly favor the player. Finding one that close is hard work — but it\'s the one honest "edge" in the slot world.',
  },
];

const GLOSSARY_MAP = new Map(GLOSSARY.map((g) => [g.key, g]));

export const TermSheetCtx = createContext<(entry: GlossaryEntry) => void>(() => {});

/**
 * Inline glossary term: dotted underline with a hover popover; clicking opens a
 * dismissable bottom sheet with the full definition — the reader never leaves the page.
 * The href stays for crawlers and middle-click, but normal clicks are intercepted.
 */
export function T({ k, children }: { k: string; children: ReactNode }) {
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

export function TermSheet({ entry, onClose }: { entry: GlossaryEntry | null; onClose: () => void }) {
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

