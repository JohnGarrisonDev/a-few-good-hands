import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        Full-pay Deuces Wild is the one machine on a casino floor where the glass, played perfectly,{' '}
        <T k="return">returns</T> more than it takes: 100.76 cents on every dollar wagered. The player has the
        edge. It is the only common casino game where that sentence is true, and casinos offer it on purpose.
      </p>
      <p className="lede">
        The honest version: the <T k="house-edge">house edge</T> is minus 0.76%, it lives on quarter machines,
        it demands a strategy most players never learn, and it hides under swings so large that a perfect
        player can go a hundred hours without seeing it. The edge is real. It is not a living.
      </p>

      <h2>The pay table, per coin</h2>
      <p>
        Full pay means this exact schedule, per coin, at five coins — where the natural royal jumps to 800. A
        $1.25 quarter hand pays five times these numbers.
      </p>
      <ul>
        <li>Natural <T k="royal-flush">royal flush</T> (no deuces): 800</li>
        <li>Four deuces: 200</li>
        <li>Wild royal flush: 25</li>
        <li>Five of a kind: 15</li>
        <li>Straight flush: 9</li>
        <li>Four of a kind: 5</li>
        <li>Full house: 3</li>
        <li>Flush: 2</li>
        <li>Straight: 2</li>
        <li>Three of a kind: 1</li>
      </ul>
      <p>
        All four 2s are <T k="wild-card">wild</T> — a deuce becomes whatever card completes the best hand — and
        because wilds make good hands common, the <T k="paytable">pay table</T> is stingy about them: a
        straight pays 2, a full house 3, three of a kind returns your bet and nothing more, and below that there
        is no payout at all. Two pair is worth zero. <strong>The lines that identify full pay are
        25-15-9-5-3</strong>, the wild royal through the full house. If any of those five numbers is smaller
        while four deuces still pays 200, it is a different game, and it does not pay over 100%.
      </p>

      <h2>Where the 100.76% comes from</h2>
      <p>
        The trainer prices every hold on every deal it shows you; a game&#39;s overall return comes from the
        standard published analysis of all 2,598,960 deals under optimal strategy. The frequencies below are
        from that analysis, rounded — read every one as &quot;about.&quot; The last figure is frequency times
        payout: each hand&#39;s share of the 100.76.
      </p>
      <ul>
        <li>Natural royal — 1 in 45,000 hands — 1.8% of return</li>
        <li>Four deuces — 1 in 4,900 — 4.1%</li>
        <li>Wild royal — 1 in 560 — 4.5%</li>
        <li>Five of a kind — 1 in 310 — 4.8%</li>
        <li>Straight flush — 1 in 240 — 3.7%</li>
        <li>Four of a kind — 1 in 15 — 32.5%</li>
        <li>Full house — 1 in 47 — 6.4%</li>
        <li>Flush — 1 in 60 — 3.3%</li>
        <li>Straight — 1 in 18 — 11.3%</li>
        <li>Three of a kind — 1 in 3.5 — 28.5%</li>
      </ul>
      <p>
        The shape of that list is the whole game. <strong>Four of a kind is the engine</strong>: it lands
        about once every fifteen hands and delivers roughly a third of everything you get back. Three of a
        kind, about two hands in seven, is a <T k="push">push</T> — a return of 1 hands your coins back. About
        55% of hands pay nothing, a <T k="hit-frequency">hit frequency</T> of 45%. The two lines everyone
        plays for, the natural royal and four deuces, add up to under 6% of the return; subtract them and the
        game pays about 94.9%. <em>Between jackpots, you are playing a 95% machine</em>; the jackpots are what
        lift it over the line.
      </p>

      <h2>Why the strategy is hard</h2>
      <p>
        Everything you learned at Jacks or Better inverts, and intuition loses money on the difference
        steadily. The site&#39;s engine priced these hands from the pay table above; each value is the{' '}
        <T k="expected-value">expected return</T> per coin bet:
      </p>
      <ul>
        <li>
          A lone deuce with four unrelated cards is worth 1.03 — more than the bet. Keep a king beside it and
          the hand drops to 0.88.
        </li>
        <li>
          Three deuces with a king and a jack: hold the three deuces alone, 14.94. Keeping the king costs more
          than three coins (11.57).
        </li>
        <li>Two pair with no deuce: keep one pair (0.56) and throw the other away (0.51 for both).</li>
        <li>
          A pair of 9s beside K-Q-J of one suit: break the pair and <T k="draw">draw</T> two to the royal,
          1.35 against 0.56.
        </li>
        <li>A pair beside four to a flush: keep the pair this time, 0.56 against 0.51.</li>
        <li>
          Ace-king with three blanks, no deuce: throw all five away (0.32). Holding the ace is worth 0.25, and
          holding both high cards is worth 0.16.
        </li>
      </ul>
      <p>
        None of these are close calls, and none of them feel right. The{' '}
        <a href="/learn/videopoker">video poker lesson</a> lays out the full ladder by number of deuces held.
        The commonly cited estimate is that a typical player gives back two to three points —{' '}
        <strong>the average player is playing a 97–98% game</strong>, an ordinary losing machine. The 100.76%
        belongs only to the people who earn it.
      </p>

      <h2>Why casinos still offer it</h2>
      <p>
        Because <strong>the casino does not pay 100.76%; it pays the blended return of everyone who sits
        down</strong>, and most of them are the 97% player above. A bank of machines a few experts beat for a
        few dollars an hour, while the rest of the room plays three points under, is a profitable bank.
      </p>
      <p>
        The denomination caps the damage. Full pay is nearly always a quarter game, sometimes nickels. A
        perfect player betting $1.25 a hand at a brisk 600 hands an hour puts $750 through the machine and
        earns about $5.70 of it. Slot-club points and the drink service are paid on that $750 of action,
        exactly as they are for the 97% player — and a comped drink an hour is a meaningful slice of $5.70.
      </p>
      <p>
        Then there is <T k="variance">variance</T>, which makes the edge invisible. The standard deviation of
        full-pay Deuces Wild is about 5 bets per hand, roughly four times blackjack&#39;s. Over a four-hour
        session of 2,400 hands at quarters, the expected result is +$23 and one standard deviation is ±$310.
        The perfect player never feels like a winner and the casino never feels like a loser. What the casino
        feels is turnover.
      </p>
      <p>
        And it is rare, surviving mainly in a shrinking number of Las Vegas locals&#39; casinos; when a bank
        is refreshed, the replacement is usually the table below.
      </p>

      <h2>Not So Ugly Deuces, and the tables that are worse</h2>
      <p>
        &quot;Not So Ugly Deuces&quot; keeps the 800 and the 200 at the top and reads 25-16-10-4-4-3 through the
        middle: five of a kind up to 16, straight flush up to 10, four of a kind <em>down</em> to 4, full house
        up to 4, flush up to 3. It returns about 99.73% with its own optimal strategy — a fine game and a full
        point below even. The arithmetic is lopsided: cutting quads from 5 to 4 costs about 6.5 points of
        return on its own, because quads arrive every fifteen hands; the four raised lines, plus a strategy
        that chases flushes and full houses harder, buy most of that back.{' '}
        <strong>The 5 on the four-of-a-kind line is the tell.</strong> When it reads 4 and four deuces still
        pays 200, you are near 99.7% at best. Other tables cut the 15 or the 9 as well; same arithmetic,
        frequency times coins lost. Keep walking. The{' '}
        <a href="/learn/paytables">pay-table lesson</a> makes reading the glass a thirty-second habit; the{' '}
        <a href="/learn/video-poker-vs-slots">video poker vs. slots</a> article explains why that only works on
        a machine that posts its math.
      </p>

      <h2>The bankroll reality</h2>
      <p>
        The natural royal arrives about once in 45,000 hands — call it 75 hours at 600 an hour — and the chance
        of playing a full cycle without one is about 37%; two cycles, 150 hours, about 14%. Four deuces come
        once in 4,900 hands, and a cycle without one is the same 37%. Those droughts are ordinary, and inside
        one you are playing the 95% game.
      </p>
      <p>
        Over one royal cycle the expected profit is about $430; one standard deviation is about $1,350, and
        two, which you will see, is about $2,700. A standard risk-of-ruin estimate puts the{' '}
        <T k="bankroll">bankroll</T> that holds a 0.76% edge with a 5-bet standard deviation to a 5% chance of
        going broke at about 5,000 bets — over $6,000 at quarters, to defend $5.70 an hour. The{' '}
        <a href="/learn/bankroll">bankroll lesson</a> covers why: profit grows with hands played, swings grow
        with the square root, and it takes tens of thousands of hands for the first to overtake the second.
      </p>
      <p>
        So the honest frame: for a player who has done the work, the price of admission is zero — slightly
        less than zero. <strong>It is the cheapest seat in the building and a poor way to make money</strong>,
        and both are true at once. For everyone else it is a 97% machine with a good story, which is exactly
        what the casino is counting on.
      </p>
      <a className="practice-cta" href="/videopoker">Practice full-pay Deuces Wild →</a>
    </>
  );
}

export const article: Article = {
  slug: 'deuces-wild-full-pay',
  title: 'Why Full-Pay Deuces Wild Pays Over 100% (and Why Casinos Still Offer It)',
  description:
    'Full-pay Deuces Wild returns 100.76% with perfect play, the only common casino game the player beats. ' +
    'The pay table, the hand math and why casinos offer it.',
  nav: 'Deuces Wild 100%',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
