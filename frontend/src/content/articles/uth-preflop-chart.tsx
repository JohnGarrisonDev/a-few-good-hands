import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        The preflop chart for Ultimate Texas Hold&#39;em fits on an index card: any pair of 3s or better, any ace,
        king-anything <T k="suited">suited</T> or king-5 offsuit and up, queen-6 suited or queen-8 offsuit and up,
        jack-8 suited and up, jack-10 offsuit. Bet 4× with those, check everything else. Run all 1,326 two-card
        starting hands through the site&#39;s chart function and exactly <strong>500 raise — 37.7%</strong>, which
        the <a href="/learn/uth">UTH lesson</a> rounds to &quot;about 38%&quot;.
      </p>
      <p className="lede">
        Memorizing it takes ten minutes. Trusting it takes longer, because it puts four antes behind ace-deuce and
        nothing behind a pair of 2s, and neither feels right. Here is every boundary, with the win rates and{' '}
        <T k="expected-value">expected values</T> the trainer&#39;s engine produces.
      </p>

      <h2>The chart, with the combos counted</h2>
      <p>
        A specific pair comes in six combinations, a suited hand in four, an offsuit hand in twelve. Counted that
        way:
      </p>
      <ol>
        <li>
          <strong>Pairs, 3s through aces:</strong> 72 of the 78 pair combos raise; only the six deuce combos check.
        </li>
        <li><strong>Any ace:</strong> all 192 ace-x combos raise, 48 suited and 144 offsuit.</li>
        <li><strong>Kings:</strong> every suited king (44 combos) and K-5 offsuit or better (96) — 140 of 176.</li>
        <li><strong>Queens:</strong> Q-6 suited and up (24 combos), Q-8 offsuit and up (48) — 72 of 160.</li>
        <li><strong>Jacks:</strong> J-8 suited and up (12 combos) plus J-10 offsuit (12) — 24 of 144.</li>
      </ol>
      <p>
        Ten-high and below never raises: 576 combos, all checks.
      </p>

      <h2>Why a small edge at 4× beats a big edge at 1×</h2>
      <p>
        Before any decision, your <T k="ante">ante</T> and <T k="blind-bet">blind</T> are already on the felt, and
        folding loses both. Everything from here on is the <T k="play-bet">play bet</T>, the one fair bet on the
        table: even money whenever you beat the dealer, at 4×, 2× or 1×. Its value is{' '}
        <strong>bet size × (chance you win − chance you lose)</strong>. If your two cards beat a random dealer
        hand more often than they lose to it, four units now beat one unit later.
      </p>
      <p>
        The other two bets are where the house lives. The ante pays only when the dealer{' '}
        <T k="qualify">qualifies</T> with a pair or better — about 83% of seven-card hands — and pushes otherwise.
        The blind loses on every losing hand but pays only on a win with a straight or better (1:1 on a straight,
        3:2 on a flush, up to 500:1 on a royal); an ordinary win pushes it. Beat a qualified dealer with one pair
        at 4× and you collect 5 antes; lose and you pay 6. For a hand that wins about as often as it loses, ante
        and blind together leak a few tenths of an ante. The play bet is the only lever for pulling that back, and
        the lever is longest before the flop.
      </p>

      <h2>Row by row</h2>
      <h3>Any ace, including ace-deuce offsuit</h3>
      <p>
        Against a random dealer hand, A-2 offsuit wins 53% of showdowns, ties 4% and loses 43%. The ace
        supplies the margin: when neither side pairs, ace-high wins; when both play a board pair, the ace{' '}
        <T k="kicker">kicker</T> decides. Ten points times four units is 0.4 antes of play-bet value, more than
        the ante and blind leak. The Monte Carlo puts the raise at about zero antes and the check at about −0.1:{' '}
        <strong>the weakest ace still earns more raising than waiting.</strong> Ace-deuce suited widens it to
        roughly +0.4 against +0.15.
      </p>
      <h3>King-deuce: offsuit checks, suited raises</h3>
      <p>
        Swap the ace for a king and the margin nearly vanishes. K-2 offsuit wins 48.4% and loses 47.4%, close
        enough to even that the 5-for-6 settlement turns the 4× bet into a loser: about −0.4 antes raising, −0.3
        checking. Put the same cards in one suit: K-2 suited finishes with a flush on 6.6% of all 2,118,760
        possible boards, against 2.0% offsuit — and the offsuit flushes need four or five of one suit on the board,
        where the dealer shares them. K-2 suited wins 51% and loses 45%, and the two lines land within a few
        hundredths of an ante of each other in the sample, which the exact published analysis resolves for
        raising. <strong>Suitedness is a small edge, but at the boundary small edges are the whole
        decision.</strong> The offsuit line falls at K-5: 51% wins against 45% losses, raise and check both about
        −0.15 with the raise a hair ahead. K-4 offsuit wins 50% and loses 46%, and there the check at about −0.2
        edges the raise at −0.3. Both lose money either way. Losing less is the whole game.
      </p>
      <h3>Queens and jacks</h3>
      <p>
        The cutoff tightens because a queen loses the kicker battle to every ace and king the dealer
        turns over: Q-8 offsuit wins 52% and loses 45%; Q-7 offsuit, 50% and 46%. The jack row holds the
        chart&#39;s one oddity: J-8 suited raises, J-9 offsuit checks, J-10 offsuit raises. Jack-ten is not the
        higher hand; it is the straighter one. J-10 sits inside four five-card straights, J-9 in three, J-8 in
        two. J-10 offsuit finishes with a straight 9.2% of the time, J-9 offsuit 7.4%,
        and a straight is the first hand the blind pays on. J-10 wins 53.8% and loses 43.3%; J-9 wins 51.6% and
        loses 45.2%. The engine has J-10 raising at about +0.2 and checking at about +0.1; J-9 sits at about −0.05
        either way, a dead heat the published chart calls for checking.{' '}
        <strong>The blind&#39;s bonus schedule is why connectors outrank kickers at the bottom of the chart.</strong>
      </p>
      <h3>Pairs: 3s raise, 2s check</h3>
      <p>
        A pair of 2s wins 49.4% of showdowns against 48.7% lost; a pair of 3s wins 52.9% and loses 45.5%. One rank
        matters that much because deuces are the only pair every other pair beats: whenever the board pairs and
        the dealer matches anything else on it, the dealer&#39;s two pair is bigger. A pair of 3s at least beats
        the dealer who pairs a deuce. The engine prices 2-2 at about −0.2 antes
        raising and −0.1 checking; 3-3 flips to about +0.1 raising and −0.05 checking.{' '}
        <strong>The lowest raise and the lowest check on the chart are one rank apart for a reason you can
        count.</strong>
      </p>

      <h2>The hidden cost of waiting to see the flop</h2>
      <p>
        The expensive mistakes sit at the top of the chart, where nobody doubts the hand and plenty of players
        check anyway, to see a flop before risking four antes. The preflop engine deals each hand out 2,500 times
        (20,000 for the figures below). To one decimal, in antes:
      </p>
      <ul>
        <li><strong>A-A:</strong> raise +3.5, check +2.1. Waiting costs 1.4 antes per hand.</li>
        <li><strong>K-K:</strong> raise +3.3, check +2.0. Cost 1.3.</li>
        <li><strong>Q-Q:</strong> raise +3.1, check +1.8. Cost 1.2.</li>
        <li><strong>10-10:</strong> raise +2.5, check +1.5. Cost 1.0.</li>
        <li><strong>A-K suited:</strong> raise +1.6, check +0.9. Cost 0.7.</li>
        <li><strong>A-K offsuit:</strong> raise +1.2, check +0.5. Cost 0.7.</li>
      </ul>
      <p>
        Pocket aces beat a random dealer hand 85% of the time and lose 14.5%, a
        70-point margin. The check branch bets 2× on the flop with any pocket pair above deuces, so the only
        difference between the lines is the size of the play bet: four units × 0.70 is 2.8 antes, two units × 0.70
        is 1.4, and the gap is the 1.4 the engine reports. At a $10 ante that is $14 per pair of aces. The entire{' '}
        <T k="house-edge">house edge</T> of this game played correctly is about 2.2% of an ante — 22 cents on that
        $10. <strong>One timid pair of aces costs more than sixty hands of perfect play.</strong> Four antes at
        once swings harder (the <a href="/learn/bankroll">bankroll lesson</a> covers that), but the swing is the
        price of the game; the check is a surcharge.
      </p>

      <h2>How the trainer grades the preflop decision</h2>
      <p>
        Flop and river grades on the <a href="/uth">UTH trainer</a> are exact: the river plays your hand against
        all 990 possible dealer holdings, and the flop enumerates every runout and dealer hand behind it.
        Preflop is about 2.1 billion evaluations per starting hand, too many for a browser, so it works in two
        parts: the verdict comes from the chart above, and the price of a wrong verdict comes from the Monte Carlo
        sample — the gap between the best line and yours, times your ante, charged as a decision cost.
      </p>
      <p>
        At 2,500 deals the estimate wobbles by a tenth of an ante and more — run ace-deuce offsuit five times and
        the raise EV lands anywhere from about −0.2 to +0.3, a spread several times wider than the gap between
        raising and checking on a boundary hand. The chart decides; the sample prices the mistake, and the
        1.4-ante gap on aces is well outside the noise. The{' '}
        <a href="/learn/first-casino-trip">first-trip guide</a> and the <a href="/learn/faq">FAQ</a> cover the
        table mechanics.
      </p>
      <a className="practice-cta" href="/uth">Practice the 4× decision →</a>
    </>
  );
}

export const article: Article = {
  slug: 'uth-preflop-chart',
  title: 'The Ultimate Texas Hold\'em 4x Chart, Explained Hand by Hand',
  description:
    'Why the UTH 4x chart raises 500 of 1,326 starting hands: the win rate and expected value behind every row, ' +
    'from ace-deuce offsuit to the jack-ten edge case.',
  nav: 'UTH 4x Chart',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
