import { T } from '../glossary';
import type { Article } from './types';

function Body() {
  return (
    <>
      <p className="lede">
        You have 11. The dealer shows a 6. You slide out a second bet, take your one card, and it&#39;s a 3. The
        dealer flips a 10, draws a 5, and collects both bets. Someone at third base mutters that doubling was
        greedy. It wasn&#39;t. <T k="double">Doubling</T> 11 against a 6 is one of the most profitable spots in
        blackjack, and it still loses three hands in ten.
      </p>
      <p className="lede">
        Here is that one hand taken apart: what each option is worth, how often each result happens, why the
        fear of catching a small card is real and still irrelevant, and what the same anatomy says about the
        other plays people hate.
      </p>

      <h2>Three options, priced</h2>
      <p>
        Every blackjack decision has an <T k="expected-value">expected value</T>: the average result, in bets,
        if you made that same play in that same spot forever. This site&#39;s engine prices all three options for
        hard 11 against a dealer 6 under the rules the trainer uses — 6 decks, dealer stands on all 17s, no
        surrender. The engine is an infinite-deck model, so treat every figure here as approximate for a real
        six-deck shoe; the shape of the argument doesn&#39;t move.
      </p>
      <ul>
        <li>
          <strong>Stand:</strong> about −0.15 bets. You hold 11 and win only if the dealer busts.
        </li>
        <li><strong>Hit:</strong> about +0.33 bets.</li>
        <li><strong>Double:</strong> about +0.67 bets.</li>
      </ul>
      <p>
        Read those as long-run averages per bet. Doubling earns two-thirds of a bet every time the situation
        comes up; hitting earns half that. The reason is not that doubling wins more often. It doesn&#39;t.{' '}
        <strong>It wins exactly as often, with twice the money on the table.</strong>
      </p>

      <h2>What a dealer 6 actually does</h2>
      <p>
        The dealer has no decisions. Showing a 6, they draw until they reach 17 or better, and the engine says
        they finish on:
      </p>
      <ul>
        <li>Bust: about 42.3%</li>
        <li>17: about 16.5%</li>
        <li>18: about 10.6%</li>
        <li>19: about 10.6%</li>
        <li>20: about 10.2%</li>
        <li>21: about 9.7%</li>
      </ul>
      <p>
        That bust rate is the highest of any <T k="upcard">upcard</T> — a 5 is next at about 41.6%, and a 10
        busts only about 23% of the time. Notice the lump at 17: a 6 with an ace underneath is a soft 17, and
        under these rules the dealer stands on it, which is why a 6 lands on exactly 17 more often than on any
        other made total.{' '}
        <strong>Against a 6, the dealer beats themselves about two hands in five before your cards matter at
        all.</strong>
      </p>

      <h2>The one card</h2>
      <p>
        Doubling means one card and no more. From hard 11, the thirteen ranks sort into four piles:
      </p>
      <ul>
        <li>
          <strong>Any ten (four ranks, 30.8%): 21.</strong> You win about 90% of the time and <T k="push">push</T>{' '}
          the rest. You cannot lose.
        </li>
        <li>
          <strong>7, 8 or 9 (23.1%): 18, 19 or 20.</strong> Heavy favorites. A 20 wins about 80% of the time and
          loses under 10%.
        </li>
        <li>
          <strong>6 (7.7%): 17.</strong> Close to a coin flip once pushes are counted — win 42%, push 17%, lose
          41%.
        </li>
        <li>
          <strong>Ace through 5 (38.5%): 12 through 16.</strong> The ace counts as 1 because the 11 is already
          there. You are stiff, and you win only when the dealer busts: about 42%.
        </li>
      </ul>
      <p>
        Weight each pile by its chance and the double comes out to <strong>win about 63%, push 7%, lose 30%</strong>.
        Losing three in ten on the best double in the game is the number to get comfortable with.
      </p>
      <p>
        Here is the part that dissolves most of the argument. Hitting produces exactly the same mix. Against a 6,{' '}
        <T k="basic-strategy">basic strategy</T> stands on any 12 or higher, so a hit also takes one card and
        stops. Same 63/7/30. The only difference between the two plays is how many bets those results settle
        at, which is why the engine&#39;s hit number is precisely half its double number.
      </p>

      <h2>The price of catching a 2</h2>
      <p>
        The objection to doubling is always the same card. What if you catch a 2? Then you are sitting on 13
        with two bets out, and you feel it. So price it. Standing on 13 against a 6 is worth about −0.15 per bet;
        with the bet doubled, that branch is worth about −0.31 of your original wager, about −$7.68 at $25. Had
        you merely hit, the same 2 leaves one bet at risk, about −$3.84. The fear is real: catching the 2 costs an
        extra $3.84 for having doubled, and the same goes for the 3, 4, 5 and ace. Five of the thirteen ranks
        punish the double by about 0.15 bets each.
      </p>
      <p>
        Now price the other side. Catch a ten and your doubled 21 is worth about +1.81 bets instead of +0.90 —
        the second bet earns an extra 0.90 bets, roughly $22.57 at $25, and four of the thirteen ranks do it. A
        9 earns an extra 0.70 bets, an 8 an extra 0.50, a 7 an extra 0.28. A 6 is a wash. Add it up: the good
        ranks add about 0.39 bets, the bad ranks subtract about 0.06, and the double nets +0.33 bets over
        hitting. <strong>At $25, hitting 11 against a 6 instead of doubling gives away about $8.34 every time the
        hand comes up</strong> — the most expensive place on the whole chart to hit when you should have doubled,
        and a mistake that feels like caution while you make it.
      </p>

      <h2>The other plays people hate</h2>
      <p>
        The same anatomy explains every line on the <a href="/learn/blackjack">basic strategy chart</a> that
        feels wrong at the table. Same engine, same rules, same caveat about the infinite-deck approximation:
      </p>
      <ul>
        <li>
          <strong><T k="split">Splitting</T> 8s against a 10.</strong> Split: about −0.49 bets. Hit the 16 or stand
          on it: about −0.54 either way. Splitting puts a second bet into a losing spot and still loses about half
          a bet on average. It loses less. Not splitting costs about 0.05 bets, or $1.26 at $25.
        </li>
        <li>
          <strong>Hitting 16 against a 7.</strong> Eight of thirteen ranks bust you on the
          spot — 61.5% — and hitting wins about 26% of the time, the same as standing. Hit: about −0.41 bets.
          Stand: about −0.48. The gain is entirely in the pushes: hitting loses about 68% of hands, standing
          about 74%. Standing costs about $1.51 at $25.
        </li>
        <li>
          <strong>Hitting 12 against a 3.</strong> The cleanest case of all. Hitting wins <em>less</em> often than
          standing — about 36% against 37% — and is still correct, because it also loses less often, about 59%
          against 63%. Hit: about −0.23 bets. Stand: about −0.25. Standing costs about 46 cents at $25.
        </li>
      </ul>
      <p>
        None of those three ever turns into a winning hand. They are losing spots, and the correct play is the
        one that loses least. <strong>Losing less is most of what basic strategy is.</strong> Doubling 11 against
        a 6 is the odd one out, a hated play where you get to win more instead, and people distrust that one too.
      </p>

      <h2>A good decision is not a good outcome</h2>
      <p>
        Poker players have a name for judging a decision by its result: results-oriented thinking. Blackjack
        invites it more than any other game because the feedback is instant and the dealer&#39;s hole card gets
        turned over in front of you. The 3 that sank your double was random. The 10 that would have made 21 was
        equally random. The play was identical in both cases, and its value, about +0.67 bets, was fixed before
        the card left the shoe. The same confusion sells{' '}
        <a href="/learn/blackjack-insurance-even-money">insurance and even money</a>, and it powers most of the{' '}
        <a href="/learn/myths">table myths</a> about third base and hot shoes.
      </p>
      <p>
        That separation is what the <a href="/blackjack">trainer</a> is built to show. It never grades you on
        whether you won; the chips do that. It grades what your choice was worth against the best available one,
        in dollars at your bet size, and over a session those differences add up into your actual{' '}
        <T k="house-edge">house edge</T> beside the theoretical 0.6%. Play a few hundred hands watching that
        number instead of the chip stack and the reflex reverses: a doubled 11 that catches a 2 stops feeling
        like a mistake, and a standing 16 that happens to win stops feeling like a good idea. The{' '}
        <a href="/learn/bankroll">bankroll lesson</a> covers why a single night can never tell the two apart —
        that is <T k="variance">variance</T> — and the <a href="/card">strategy card</a> fits the whole chart on
        a phone screen. Doubling 11 against a 6 is the hand to learn the lesson on, because it will lose in front
        of you again and again, and it will never once be wrong. Keep doubling.
      </p>
      <a className="practice-cta" href="/blackjack">Practice the plays that feel wrong →</a>
    </>
  );
}

export const article: Article = {
  slug: 'double-eleven-vs-six',
  title: 'Doubling 11 Against a 6: Anatomy of a Correct Play That Loses',
  description:
    'Doubling 11 against a dealer 6 is worth about +0.67 bets and still loses three hands in ten. Every option ' +
    'priced by the site\'s own engine, and why results lie.',
  nav: 'Double 11 vs 6',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 6,
  component: Body,
};
