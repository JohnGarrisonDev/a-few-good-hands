import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        Walk any slot aisle and you pass video poker machines in the same cabinets, at the same denominations,
        under the same button. They are not the same purchase. One deals from a real 52-card deck and prints its
        payouts on the glass, so its price can be worked out to the hundredth of a percent. The other keeps its
        price a secret. At a comparable bet and pace, a good video poker machine costs roughly a seventeenth of
        what a typical penny slot costs per hour, and the gap is entirely visible math.
      </p>

      <h2>Posted math vs. hidden math</h2>
      <p>
        A video poker <T k="paytable">pay table</T> is a complete disclosure. The deck is a real deck, the draw
        is a real draw, and once you know what each hand pays you can compute the exact return with perfect
        play — nobody has to take the casino&#39;s word for it. 9/6 Jacks or Better returns 99.54%. Shave the
        full house and flush to 8/5 and the same game returns 97.30%; 7/5 returns 96.15%. The{' '}
        <a href="/learn/paytables">pay-table lesson</a> shows how to read them in ten seconds.
      </p>
      <p>
        A slot&#39;s return is set by a math sheet you will never see. Two identical machines side by side can run
        different returns, and nothing on the screen says which. What is known comes from state
        revenue reports: Nevada&#39;s published figures have penny machines keeping about 10–12% of every dollar and
        dollar machines roughly half that. Online slots, which usually print their RTP in the help screen, mostly
        run 94–97%. <strong>Video poker lets you price the game before you sit down; a slot only lets you
        guess.</strong>
      </p>

      <h2>The hourly price at the same bet</h2>
      <p>
        Expected cost is total action times <T k="house-edge">house edge</T>, so hold bet size and speed steady
        and compare. A quarter video poker machine at max coins is $1.25 a hand; a comfortable pace is
        about 600 hands an hour, which is $750 of action. On 9/6 Jacks or Better the edge is 0.46%, so the hour
        costs about $3.45. Double Double Bonus 9/6, at 98.98%, costs about $7.65. Even the 7/5 table — the worst
        Jacks or Better you should ever sit at — costs about $29 for the same hour.
      </p>
      <p>
        Now the slot. A penny video slot at $1.20 a spin and 500 spins an hour is $600 of action; at a 10% hold
        that hour costs about $60. Same seat, same coins, roughly seventeen times the price of the good video
        poker machine and twice the price of the bad one. If it happens to be holding 12% instead of 10%, the
        hour is $72, and nobody at the machine can tell. <strong>Edge and speed both multiply, and the slot
        loses on both.</strong>
      </p>

      <h2>One decision vs. none</h2>
      <p>
        Video poker has exactly one decision per hand: which of the five cards to hold. There are 32 ways to do
        it and one has the highest <T k="expected-value">expected value</T>. The trainer prices all 32, and the
        gaps are not subtle. Dealt 6♠ 6♥ K♦ Q♣ 4♠ on 9/6 Jacks or Better, holding
        the pair of sixes returns 0.82 bets per hand; holding the king and queen, which feels more promising,
        returns 0.49. That one hold costs a third of the bet — about 41 cents on a $1.25 hand — and it comes up
        all night. Dealt 7♠ 7♥ 2♠ 9♠ J♠, the four spades are worth 1.21 bets and the pair 0.82. Same idea,
        bigger gap.
      </p>
      <p>
        A slot has no decision at all. The <T k="rng">RNG</T> settles the spin the instant you press the button;
        the reels, the near misses and the celebration replay a result already booked. Timing, stopping the
        reels early, the number of lines — none of it moves the return per dollar, and bet size only does on a
        machine that pays its jackpot or bonus solely at max bet.{' '}
        <strong>On a video poker machine your skill is a line item in the price. On a slot it isn&#39;t on the
        invoice.</strong>
      </p>

      <h2>Where the money comes back</h2>
      <p>
        Same return, different feel. Jacks or Better pays back front-loaded: about 45% of hands return something,
        and pairs, two pair and three of a kind together deliver roughly 70% of the return. The{' '}
        <T k="royal-flush">royal flush</T> contributes only about 2%. It arrives about once per 40,400 hands with
        correct play — at 600 hands an hour, roughly 67 hours per royal — so between royals the machine is
        running around 97.5%. The swings are a known quantity too: a standard deviation of
        about 4.4 bets per hand, wide enough to notice and narrow enough to plan around.
      </p>
      <p>
        A slot&#39;s math sheet does the opposite. Hit frequency is often lower, many
        &quot;wins&quot; are smaller than the bet that produced them, and a large share of the return is pushed
        into free-spin rounds and jackpots that trigger rarely. A wide-area <T k="progressive">progressive</T> is
        the extreme case: a slice of every spin finances a prize you almost certainly will not win, so the base
        game runs well below the machine&#39;s overall return until the day somebody hits.{' '}
        <strong>Video poker pays you back as a steady drip with a rare bonus on top; a slot withholds the drip
        to fund the fireworks.</strong> The <a href="/learn/bankroll">bankroll lesson</a> puts session-sizing
        numbers on both shapes.
      </p>

      <h2>The skill tax</h2>
      <p>
        The posted 99.54% assumes you hold the right cards every time. Almost nobody does. Players who have never
        studied typically give back another 1–3% of action to mistakes — the low pair broken for two face cards,
        the flush draw abandoned for a pair, the kicker held for luck. At $750 an hour each 1% is $7.50, so a 2%
        skill tax turns the $3.45 machine into an $18 machine. Still cheaper than the slot, but not by the
        margin on the glass. The glossary calls this the gap between{' '}
        <T k="implied-vs-actual">implied and actual edge</T>, and closing it is what this site is for: the{' '}
        <a href="/learn/videopoker">video poker lesson</a> is the hold ladder, and the trainer prices every hold
        in dollars until your actual number converges on the posted one.
      </p>

      <h2>Comps are paid on action, not on loss</h2>
      <p>
        Slot clubs award points on coin-in — the money you put through the machine — not on what you lose. Put
        $750 an hour through either machine and you earn the same points. A typical club returns a few tenths of
        a percent of coin-in as free play; call it 0.25%, which is about $1.90 an hour. The slot player pays
        about $75 in expected loss to earn that $1.90. The 9/6 video poker player pays about $3.45. Many clubs
        award video poker points at half rate or less; even at half, the video poker player gets back over a
        quarter of their expected loss in comps, against about 2.5% for the slot player.{' '}
        <strong>The loyalty program is a rebate on action, and the cheapest action in the building earns it at
        the same rate.</strong>
      </p>

      <h2>The honest case for slots</h2>
      <p>
        None of this makes slots a mistake. It makes them a purchase. Here is what the money buys. No
        thinking: a slot asks nothing of you after the spin button, and some evenings that is the whole point.
        Jackpots video poker cannot offer: a royal at quarters is $1,000, while a linked progressive runs to
        eight figures, at lottery odds. Themes, sound and bonus rounds. A cheaper seat: a
        penny slot takes well under a dollar a spin, and while nickel video poker exists, the pay tables at that
        level are usually the stingy kind. If the lights and the lottery-ticket dream are the product you want,
        the <a href="/learn/slots">slots lesson</a> is the guide to buying it well — match the{' '}
        <T k="volatility">volatility</T> to your bankroll, skip the wide-area monsters unless
        the dream is the point, and slow down, because half the spins is half the price.
      </p>
      <p>
        If what you actually like is the cabinet — sitting alone, pressing buttons, the shot at a big hit — video
        poker is the same experience with the price printed on the glass and a way to lower it. Read the{' '}
        <a href="/learn/paytables">pay-table lesson</a> so you sit at the right machine, then learn to hold the
        right cards. Full-pay <a href="/learn/deuces-wild-full-pay">Deuces Wild</a> even returns more than 100%
        with perfect play — a figure no slot&#39;s math sheet carries.
      </p>
      <a className="practice-cta" href="/videopoker">Practice video poker with the math showing →</a>
    </>
  );
}

export const article: Article = {
  slug: 'video-poker-vs-slots',
  title: 'Video Poker vs. Slots: Same Cabinet, Very Different Price',
  description:
    'What a video poker machine and a slot really cost per hour at the same bet, why only one has a decision, ' +
    'and when a slot is still the right buy.',
  nav: 'Video Poker vs Slots',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
