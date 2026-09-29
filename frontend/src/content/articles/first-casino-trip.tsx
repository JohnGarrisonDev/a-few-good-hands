import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        A casino is built to make a first-timer feel lost, and that feeling is worth money to the house. The fix is
        not confidence. It is arithmetic: decide what the evening may cost, pick a game whose price you know, and
        learn its one chart before you walk in. Do that and the building becomes what it is — an entertainment
        venue with a posted price per hour.
      </p>
      <p className="lede">
        The honest one-sentence answer: <strong>bring a fixed amount of cash, play blackjack or video poker the way
        this site taught you, and expect to pay a few dollars an hour for the privilege</strong>.
      </p>

      <h2>Decide the number before you leave the room</h2>
      <p>
        Pick the amount you can lose without it changing your week,
        take it out in cash, and leave the debit card in the hotel safe. That is not a moral rule; it is a{' '}
        <T k="bankroll">bankroll</T> rule, and it works because the casino cannot sell you a second buy-in you did
        not bring. Whatever is gone at the end was the price of the entertainment — the{' '}
        <a href="/learn/bankroll">bankroll lesson</a> has the full argument.
      </p>
      <p>
        Size it to the game. For blackjack or the poker-pit games, 40–50 bets survives an ordinary night&#39;s
        swing: about $200–250 at a $5 table, $400–500 at a $10 table. If your number does not stretch that far,
        the fix is a cheaper table, not a braver attitude. Expect swings that dwarf the cost: three hours at a $10
        blackjack table costs about $13 in <T k="expected-value">expectation</T>, while one standard deviation on
        that same evening is roughly ±$165. That is <T k="variance">variance</T>, and it is normal.
      </p>

      <h2>Pick the game by its price</h2>
      <p>
        Every game has a <T k="house-edge">house edge</T> — the share of each bet the casino
        keeps on average — and a speed. Multiply by your bet size and you have an hourly price. The menu, cheapest
        first:
      </p>
      <ul>
        <li>
          <strong>Blackjack with <T k="basic-strategy">basic strategy</T>: about 0.6%.</strong> At $10 a hand and
          70 hands an hour, about $4 an hour. Played by feel, 2% or more — same table, worse decisions.{' '}
          <a href="/learn/blackjack">Lesson.</a>
        </li>
        <li>
          <strong>Video poker, 9/6 Jacks or Better: about 0.5%</strong> (a 99.54% return). At
          five quarters a hand and 600 hands an hour, about $3.50. The catch: 9/6 is the good{' '}
          <T k="paytable">pay table</T>; 8/5 keeps about 2% more of every dollar.{' '}
          <a href="/learn/videopoker">Lesson.</a>
        </li>
        <li>
          <strong>Ultimate Texas Hold&#39;em: about 2.2% of your <T k="ante">ante</T></strong> — about 0.5% of all
          the money you put in play, because optimal play bets big and early. <a href="/learn/uth">Lesson.</a>
        </li>
        <li>
          <strong>Three Card Poker: about 3.4% of the ante</strong> with the Q-6-4 rule — about 34 cents a hand at
          $10. Play every hand and it climbs to about 7.7%. <a href="/learn/threecard">Lesson.</a>
        </li>
        <li>
          <strong>Slots: about 5–12%</strong>, penny machines at the expensive end, and nothing you do changes it.
          At $1.20 a spin and 500 spins an hour, a 10% machine costs about $60 an hour, against about $4 at
          blackjack. <a href="/learn/slots">Lesson.</a>
        </li>
      </ul>

      <h2>Practice before you go</h2>
      <p>
        Blackjack is the classic first study: one chart covers the whole game, and the{' '}
        <a href="/blackjack">blackjack trainer</a> grades every decision against the math that built it. Play
        until an hour goes by with no flagged mistakes. The rules that carry most of the weight: always{' '}
        split aces and eights, never split tens, double 11 against anything but
        an ace, hit 16 against a 7 or higher, hit 12 against a 2 or 3. Then bookmark the{' '}
        <a href="/card">strategy card</a> — the charts alone, phone-sized, and allowed at the table.
      </p>
      <p>
        If the poker pit appeals, <a href="/threecard">Three Card Poker</a> takes five minutes to learn and{' '}
        <a href="/uth">Ultimate Texas Hold&#39;em</a> takes an evening — its{' '}
        <a href="/learn/uth-preflop-chart">4× chart</a> raises about 38% of starting hands, which feels reckless
        until the trainer prices the alternative. For a machine, drill <a href="/videopoker">video poker</a> until
        the holds are automatic, then read the <a href="/learn/paytables">pay-table lesson</a> twice — the
        best-paid five minutes on this site.
      </p>

      <h2>Finding a table and sitting down</h2>
      <p>
        Table minimums float with demand. The $5 and $10 blackjack tables of a Tuesday afternoon commonly become
        $15, $25 or more by Saturday night. Go when it is quiet: cheaper tables, empty seats, and a
        dealer with time to walk you through your first hand. The placard at each table shows the minimum and the
        rules that matter — look for <strong>blackjack pays 3 to 2</strong>, and keep walking past anything that
        says 6 to 5.
      </p>
      <h3>Buying in</h3>
      <p>
        Between hands, lay your cash flat on the felt — dealers cannot take money from your hand, because the
        cameras need to see it. The dealer counts it out loud and pushes you chips. Bet by placing chips in the
        circle before the deal; once the first card is out, do not touch them again. When you leave, ask to{' '}
        &quot;color up&quot; — small chips become big ones — and cash them at the cage.
      </p>
      <h3>Signals</h3>
      <p>
        On a shoe game the cards are dealt face up and <strong>you never touch them.</strong> Decisions are made
        by hand, again for the cameras: tap the felt to hit, wave a flat palm over your cards
        to stand. To double or split, put a second stack of chips beside the first — never on top of it — and
        hold up one finger for a double, two for a split. Phones stay in your pocket at the table.
      </p>
      <h3>Tipping</h3>
      <p>
        Dealers are tipped, usually by placing a small bet for them in front of your own or by handing over a chip
        when you leave. A dollar or two now and then at a low-limit table is normal. Not mandatory, and it does not
        change the cards.
      </p>

      <h2>The players club: two minutes, worth it</h2>
      <p>
        Sign up for the free players card before you play anything. Hand it to the dealer or slide it into the
        machine, and a slice of your play comes back as free play, food or a room discount. The slice is small —
        usually a fraction of a percent of what you wager — but it is the only transaction in the building with a
        positive return for you. It does not change your odds; the <a href="/learn/myths">myths lesson</a> covers
        that superstition.
      </p>

      <h2>The traps</h2>
      <p>Each looks like a good idea on a first visit:</p>
      <ul>
        <li>
          <strong>Side bets.</strong> Pair Plus, 21+3, Trips, Perfect Pairs: flashy payout columns, house edges
          typically 2–8%. Blackjack played well costs about half a percent; the side bet on the same felt is where
          the casino earns back what it lost when you learned basic strategy.
        </li>
        <li>
          <strong>6:5 blackjack.</strong> Paying 6 to 5 on a blackjack instead of 3 to 2 adds about 1.4% to the
          edge — more than tripling the cost of the game. No strategy fixes it.{' '}
          <a href="/learn/six-five-blackjack">Read the felt.</a>
        </li>
        <li>
          <strong>Insurance and even money.</strong> A separate bet that the dealer has a ten under an ace. It
          pays 2 to 1 on something that happens less than a third of the time, for a house edge around 7%. The{' '}
          <a href="/learn/blackjack-insurance-even-money">full arithmetic</a> is short; the answer is never.
        </li>
        <li>
          <strong>&quot;Hot&quot; and &quot;due&quot; machines.</strong> Every spin is decided by an{' '}
          <T k="rng">RNG</T> with no memory. A machine that just paid is neither spent nor warm, and the one that
          has not paid in an hour owes you nothing.
        </li>
        <li>
          <strong>The ATM.</strong> Casino ATMs charge steep fees — often $5 to $10 a withdrawal before your own
          bank adds its cut. This is why the card stays in the room.
        </li>
        <li>
          <strong>Chasing.</strong> Betting bigger to win back a loss is the same negative-EV bet with more money
          on it. The number you chose upstairs is the number. When it is gone, the evening was purchased and
          delivered.
        </li>
      </ul>

      <h2>The room has no clocks</h2>
      <p>
        That is on purpose. No windows either, and where the drinks are comped they keep arriving. The house edge
        is charged per bet, so the two levers that cut your bill are the price of the game and the number of bets
        you make: play slower, sit out a shoe, walk to dinner. Set an alarm for when you want to leave and honor
        it, up or down — up especially, since the math does not care that you are ahead.
      </p>
      <p>
        If the number stops feeling like a price and starts feeling like something you need to win back, that is
        the signal to stop. Call or text
        1-800-GAMBLER, any hour — confidential and free. Then come back here, where the chips are imaginary and the
        math is the same.
      </p>
      <a className="practice-cta" href="/learn">Back to the Strategy School →</a>
    </>
  );
}

export const article: Article = {
  slug: 'first-casino-trip',
  title: 'How to Prepare for Your First Casino Trip',
  description:
    'A numbers-first guide to a first casino visit: set the budget, pick games by house edge, learn buy-ins, hand ' +
    'signals and tipping, and dodge the classic traps.',
  nav: 'First Casino Trip',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
