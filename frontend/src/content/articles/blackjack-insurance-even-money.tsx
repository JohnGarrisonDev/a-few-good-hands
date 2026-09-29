import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        The dealer turns up an ace, sweeps a hand across the felt and asks the table: &quot;Insurance?&quot; The
        house has the dealer make that offer, out loud, on every ace. Here is what it is worth in a six-deck game:
        a bet that wins about 31% of the time, paid as though it won a third of the time, losing around 7% of
        every dollar staked. &quot;Even money&quot; on your own blackjack is the identical bet with the chips
        hidden. <T k="basic-strategy">Basic strategy</T>&#39;s answer to both is no, and the rest of this page is
        the arithmetic behind that word.
      </p>

      <h2>What insurance actually is</h2>
      <p>
        When the dealer&#39;s <T k="upcard">upcard</T> is an ace, you may place a separate{' '}
        <T k="bet-wager">bet</T> of up to half your original wager on one proposition: the dealer&#39;s{' '}
        <T k="hole-cards">hole card</T> is a ten-value card, completing a blackjack. It pays 2:1 and settles before
        anyone plays a hand. Your own hand is not part of the proposition. The name comes from the tidy way it
        nets out when the dealer does have a natural — you lose your main bet, win twice a half-bet, and walk away
        flat — but the name is marketing. <strong>Insurance is a bet that the hole card is a ten</strong>, nothing
        more, and it should be priced like one.
      </p>

      <h2>Pricing it in a six-deck shoe</h2>
      <p>
        Six decks hold 312 cards, 96 of them ten-value. You can see three: the dealer&#39;s ace and your own two
        cards. Suppose neither of yours is a ten. Then 96 of the 309 unseen cards win the bet, a probability of
        96/309, or 31.1%. The fair payout on a 31.1% shot is about 2.22:1; the casino pays 2:1. Put a dollar on it
        and the <T k="expected-value">expected value</T> is 2 × 0.3107 − 0.6893 = −0.068:{' '}
        <strong>the bet loses 6.8 cents of every dollar staked</strong>, on average.
      </p>
      <p>
        It gets worse as your hand gets better. Hold one ten and 95 of 309 unseen cards win, 30.7%, and the loss
        rate is 7.8%. Hold a pair of tens — the 20 everyone wants to protect — and it is 94/309, 30.4%, losing
        8.7 cents on the dollar. Averaged across every hand you could be dealt, the chance is 96/311 and the loss 7.4%,
        which is the number standard references quote for six-deck insurance. Call it about 7%. The wrinkle worth
        remembering is the direction of the correction: <strong>the stronger your hand, the worse the
        insurance</strong>, because the tens in your hand are tens that can&#39;t be under the dealer&#39;s ace.
      </p>

      <h2>Even money is insurance in disguise</h2>
      <p>
        Now you hold the blackjack and the dealer shows an ace. Before checking the hole card, the dealer offers
        &quot;even money&quot;: take a 1:1 payout right now instead of 3:2 with the risk of a{' '}
        <T k="push">push</T>. This feels like a different decision. It isn&#39;t. Insure your blackjack for half a
        bet and follow the two outcomes: if the dealer has a natural, your hand pushes and the insurance pays one
        bet; if not, your hand pays 1.5 and the insurance loses 0.5. <strong>Either way you collect exactly one
        bet.</strong> Even money is the casino skipping the chip-shuffling and handing you that flat result.
      </p>
      <p>
        So price it the same way. Your blackjack holds one of the tens, leaving 95 of 309 unseen cards to complete
        the dealer&#39;s natural: 30.7%. Refusing the offer is worth 1.5 × (1 − 0.307) = 1.039 bets. Taking it is
        worth 1.000. <strong>Every even-money take forfeits about 0.039 bets, or 3.9% of your wager.</strong> For
        scale, the whole game costs a perfect player about 0.6% of a bet per hand under these rules, so one
        even-money take costs roughly what seven hands of flawless blackjack cost. The situation arrives about
        once every 280 hands — about four hours at a moderately paced table — which is why the habit never looks
        expensive and why it&#39;s worth fixing anyway. Bad math at low frequency is still bad math.
      </p>

      <h2>The pull, and why it isn&#39;t stupid</h2>
      <p>
        &quot;Protect a good hand.&quot; &quot;Lock in the win.&quot; &quot;A guaranteed win is a win.&quot; These
        aren&#39;t dumb sentences; they describe a real thing you&#39;re buying. Refusing even money pays 1.5 bets
        about 69% of the time and nothing about 31% of the time, a swing of about 0.69 bets of standard deviation
        on that one hand. Taking it removes the <T k="variance">variance</T> entirely. What you pay for the
        certainty is 0.039 bets, and that is the honest way to see the offer:{' '}
        <strong>the casino is selling you a smaller heartbeat, for about seven hands&#39; worth of{' '}
        <T k="house-edge">house edge</T></strong>. A pushed blackjack feels like a theft in a way a lost 16 never
        does, and the dealer&#39;s offer lands at precisely the moment that feeling peaks. Recognizing the pitch
        doesn&#39;t make you immune to it; knowing the price does.
      </p>
      <p>
        The same logic settles &quot;protecting&quot; a 20. Your 20 and the insurance bet are two separate wagers
        that happen to settle on the same card. The 20 is worth what it is worth against an ace regardless, and
        stapling an 8.7%-edge side bet to it for half your wager costs about 4.4% of your main bet. The hand you
        most want to protect is the one that makes the protection worst.
      </p>

      <h2>When insurance is actually correct</h2>
      <p>
        There is exactly one case. A 2:1 payout breaks even when the winning card makes up one-third of what is
        unseen; a fresh six-deck shoe has tens at 96/312, or 30.8%, and every card dealt nudges that figure.
        Insurance becomes a good bet the moment more than a third of the remaining cards are tens — with two decks
        left, that means 35 or more tens where 32 would be expected. Nobody can see that from the felt. A card
        counter tracks it, and the published Hi-Lo index for insurance is a true count of about +3 or higher;
        it&#39;s widely listed as the single most valuable index play in the game, which is a fair hint about how
        bad the bet is the rest of the time. If you aren&#39;t counting, your best estimate of the ten density is
        &quot;about 31%,&quot; and at 31% the bet loses.{' '}
        <strong>Basic strategy never takes insurance because basic strategy doesn&#39;t know the count.</strong>{' '}
        The <a href="/learn/blackjack">blackjack lesson</a> covers the rest of the chart; the answer on this line
        is the same one word on every published version of it.
      </p>

      <h2>Why the dealer keeps asking</h2>
      <p>
        Dealers announce insurance on every ace and even money on every blackjack against one because house
        procedure says so. It&#39;s routine, not a con; the dealer usually has no opinion about it. The house
        does. On a game that yields about 0.6% from a competent player, a side bet that keeps 7% of its stake is
        the best-paying sentence at the table. A player who insures for the maximum every time it&#39;s offered
        adds about 0.28% of a bet per hand to what the game costs — roughly half the price of the entire rest of
        the game, stacked on top of it, from one question asked once every 13 hands. At $10 a hand and 70 hands
        an hour that&#39;s about $2 an hour, on a game whose whole base cost at that pace is about $4. Say no,
        and play your hand.
      </p>
      <p>
        This is also why the <a href="/blackjack">trainer</a> doesn&#39;t ask. A dealer natural is settled the
        moment it&#39;s dealt and your own is paid 3:2 on the spot; there is no version of the offer a
        basic-strategy player should accept, so there is nothing to drill. One note on the engine: it models an
        infinite deck, in which the chance of a ten under the ace is a fixed 4/13, or 30.8%. That prices
        insurance at −7.7% and even money at −3.8%, against the finite six-deck figures of about −7% and −3.9%
        above. The gap is a fraction of a percent and the conclusion is the same on both sides of it. The
        decisions that do carry weight — <a href="/learn/double-eleven-vs-six">doubling 11 against a 6</a>, hitting
        a 16 against a 10 — are the ones to spend your attention on, and the{' '}
        <a href="/learn/paytables">pay-table lesson</a> and the <a href="/learn/six-five-blackjack">6:5 article</a>{' '}
        cover where the rest of the edge hides. The <a href="/learn/myths">myths lesson</a> files insurance
        alongside its relatives.
      </p>
      <a className="practice-cta" href="/blackjack">Practice the hands that do have a decision →</a>
    </>
  );
}

export const article: Article = {
  slug: 'blackjack-insurance-even-money',
  title: 'Blackjack Insurance and Even Money: The Math Nobody Explains at the Table',
  description:
    'Blackjack insurance pays 2:1 on a bet that wins about 31% of the time, and even money is the same bet in ' +
    'disguise. The six-deck math, priced exactly.',
  nav: 'Insurance & Even Money',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
