import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        Two blackjack tables, same pit, same $10 minimum, same six-deck shoe. One felt says &quot;Blackjack pays 3
        to 2.&quot; The other says &quot;Blackjack pays 6 to 5.&quot; They look identical, they deal identically,
        and one of them costs more than three times as much to sit at. The 6:5 payout adds about 1.4% to the{' '}
        <T k="house-edge">house edge</T> — more than every other rule on the placard put together — and no
        strategy buys any of it back.
      </p>
      <p className="lede">
        This article prices the change three ways: per blackjack, per hour, and next to every other rule you will
        ever see posted. The short answer is already on the felt. Keep walking.
      </p>

      <h2>What 3:2 and 6:5 mean on a $10 bet</h2>
      <p>
        A blackjack — a natural, an ace plus a ten-value card on your first two — is the one hand that pays a
        premium. At 3:2 a $10 bet wins $15. At 6:5 the same hand wins $12. Every other result on the table is
        unchanged: wins pay even money, losses lose, ties <T k="push">push</T>. So the entire rule change is{' '}
        <strong>$3 taken off the top of every blackjack you are dealt</strong>. At $25 the gap is $37.50 against
        $30; at $100 it is $150 against $120. The ratio is what matters, and the ratio is fixed: a 6:5 blackjack
        pays 20% less than a 3:2 one.
      </p>
      <p>
        Three dollars sounds like a rounding error. That is exactly why the rule spread.
      </p>

      <h2>How often a blackjack actually gets paid</h2>
      <p>
        To price the rule you need one number: how often you are dealt a natural that the dealer doesn&#39;t
        match. A six-deck shoe holds 312 cards, 24 of them aces and 96 of them ten-value, so the chance of a
        natural is 2 × (24/312) × (96/311), which works out to <strong>about 4.75% of hands</strong>. Not all of
        those get paid. Once you hold a natural, 310 cards remain with 23 aces and 95 tens, and the dealer makes
        a natural of their own about 4.56% of the time — a push at either payout. Remove those and a paid
        blackjack lands on <strong>about 4.53% of hands, roughly one hand in 22</strong>.
      </p>
      <p>
        Now the arithmetic. On each of those hands 6:5 pays 0.3 of a bet less than 3:2. Multiply: 0.3 × 4.53% =
        1.36% of every bet you place, gone. Call it <strong>about 1.4% added to the house edge</strong>. This
        site&#39;s own engine agrees. Run perfect <T k="basic-strategy">basic strategy</T> through it at 3:2
        under the trainer&#39;s rules (six decks, dealer stands on all 17s, double after split allowed) and the
        edge comes out at about 0.57% — an infinite-deck approximation, which the site quotes as about 0.6%. Swap
        the blackjack payout for 6:5, change nothing else, and it reports about 1.92%. A game that was costing you
        half a percent now costs nearly two — a 3.4× increase from one line of text.
      </p>

      <h2>The price per hour</h2>
      <p>
        Expected cost is action times edge, the same multiplication the{' '}
        <a href="/learn/bankroll">bankroll lesson</a> runs on every game. A $10 player at a normal pace of about
        70 hands an hour puts $700 through the table every hour. At 3:2 and about 0.6% that is roughly $4.20 an
        hour in expected loss. At 6:5 the same hour costs about $13.70. The difference — about $9.50 an hour — is
        the 6:5 surcharge, and you can cross-check it without a single percentage: 70 hands × 4.53% is a little
        over three paid blackjacks an hour, each shorted $3.
      </p>
      <p>
        At $25 the numbers scale exactly. $1,750 an hour of action costs about $10.50 at 3:2 and about $34.30 at
        6:5, a surcharge of about $24 an hour. Over a four-hour session that is close to $100 of{' '}
        <T k="expected-value">expected value</T> handed over for nothing — no extra side bet, no worse cards, no
        mistakes. <T k="variance">Variance</T> will hide the number on any single night. It will not hide it over
        a year of weekends.
      </p>

      <h2>Next to every other rule on the placard</h2>
      <p>
        What each blackjack rule does to the edge has been published for decades. These are the standard
        approximate figures for a six-deck game; read each one as &quot;about&quot;:
      </p>
      <ul>
        <li>Dealer hits soft 17 (H17): about +0.2% for the house</li>
        <li>No double after split: about +0.1%</li>
        <li>Late surrender offered: about −0.08% (your favor)</li>
        <li>Resplitting aces allowed: about −0.07%</li>
        <li>Single deck instead of six: about −0.5%</li>
        <li><strong>Blackjack pays 6:5: about +1.4%</strong></li>
      </ul>
      <p>
        Add up the size of everything on that list except the last line and you get about 0.95%.{' '}
        <strong>The 6:5 line alone is bigger than all the others combined</strong>, in either direction. Players
        will hunt for a table that lets them resplit aces, worth seven hundredths of a percent, and then sit at a
        6:5 game worth twenty times that against them. The single-deck line deserves its own warning. The
        &quot;single deck&quot; games marketed as a premium product are, with rare exceptions, 6:5 games, and a
        single-deck 6:5 game nets out about 0.9% worse than an ordinary six-deck 3:2 shoe. Fewer decks make
        naturals slightly more frequent, which at 6:5 makes the surcharge slightly larger — about 1.39% instead
        of 1.36%. The deck count is the bait; the payout is the hook.
      </p>

      <h2>Where 6:5 hides</h2>
      <p>
        It is not distributed at random. You find it where the players least likely to check are sitting: the
        lowest-minimum tables in the pit, the party pit with the music and the dancers, the single- and
        double-deck pitch games sold as old-school, and on the Las Vegas Strip most of the main floor, where 3:2
        has retreated toward higher minimums and the high-limit room. A 6:5 table does not look different. It
        deals at the same speed, the dealer is just as friendly, and your strategy card works exactly as before.
      </p>
      <p>
        Spotting it takes three seconds and no math. The felt and the limits placard are blackjack&#39;s{' '}
        <T k="paytable">pay table</T>: the payout is usually printed on the felt in the arc in front of the
        dealer, and the placard lists the rules. If neither is clear, ask — &quot;does blackjack pay three to two
        here?&quot; is a question every dealer answers a dozen times a shift, and nobody minds it. The{' '}
        <a href="/learn/paytables">pay-table lesson</a> covers the rest of the sign; on a{' '}
        <a href="/learn/first-casino-trip">first casino trip</a>, reading this one line is the habit worth
        bringing.
      </p>

      <h2>The strategy takeaway</h2>
      <p>
        There is no chart adjustment. Basic strategy is built from the expected value of every{' '}
        <T k="hit-stand">hit or stand</T>, <T k="double">double</T> and <T k="split">split</T> decision, and none
        of those decisions involve a natural — a blackjack is paid the instant it is dealt, before you have
        anything to decide. Change the payout and every line of the <a href="/learn/blackjack">chart</a> stays
        exactly where it was. You cannot play your way out of the 1.4%, because it is charged on hands where you
        never act.
      </p>
      <p>
        One footnote for the curious. At 6:5, taking even money on your own blackjack against a dealer ace flips
        from wrong to right: declining it is worth 1.2 × (1 − 95/309), about 0.83 of a bet, while even money is
        a sure 1.0. Many 6:5 tables don&#39;t offer it for exactly that reason; insuring the hand yourself instead
        is worth about 0.79, still worse than declining. Where it is offered, the spot comes up on about 0.35% of
        hands and recovers about 0.06% of edge — a rounding error on a 1.4% problem, not a fix. At 3:2 the
        answer stays never, for the reasons in the{' '}
        <a href="/learn/blackjack-insurance-even-money">insurance and even money article</a>.
      </p>
      <p>
        So the only correct decision at a 6:5 table is the one you make standing up. If a 3:2 game is anywhere in
        the building, that is your table. If it isn&#39;t, a 9/6 Jacks or Better machine at 0.46% is a better bet
        than 6:5 blackjack at about 1.9%, and so is every pay table in the{' '}
        <a href="/videopoker">video poker trainer</a>. And if the 6:5 table is genuinely the only game in town,
        you now know its price — about $9.50 an hour at $10 — and can decide whether the evening is worth it. The
        math does not care which you choose. It only asks that you read the sign first.
      </p>
      <a className="practice-cta" href="/blackjack">Practice at a 3:2 table →</a>
    </>
  );
}

export const article: Article = {
  slug: 'six-five-blackjack',
  title: '6:5 Blackjack: What It Actually Costs You',
  description:
    'A 6:5 blackjack table adds about 1.4% to the house edge — more than every other rule on the placard ' +
    'combined. The cost per hand, per hour and in context.',
  nav: '6:5 Blackjack',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
