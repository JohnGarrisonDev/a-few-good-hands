import { T } from '../glossary';
import type { Article, FaqItem } from './types';

// Answers are plain text on purpose: they are reused verbatim as FAQPage structured data.
const FAQ: FaqItem[] = [
  {
    q: 'What does "house edge" actually mean?',
    a:
      'The percentage of every bet the casino keeps, averaged over the long run. A 1% house edge means that for ' +
      'each $100 you wager you lose $1 on average — not per hand, not per session, but across thousands of bets. ' +
      'Blackjack played perfectly under this site\'s rules costs about 0.6%; 9/6 Jacks or Better costs 0.46%; a ' +
      'typical penny slot keeps 8 to 12%. Tonight\'s result can land anywhere. The edge is the average tonight is ' +
      'drawn from.',
  },
  {
    q: 'What is expected value, in one sentence?',
    a:
      'Expected value is what a decision wins or loses on average if you made it in the same spot forever. One ' +
      'example from this site\'s blackjack engine: holding 11 against a dealer 6, doubling is worth about +0.67 ' +
      'bets and hitting about +0.33, so on a $10 bet the double earns roughly $6.70 on average and the hit about ' +
      '$3.30. The double still loses sometimes. It is still right every time.',
  },
  {
    q: 'If I learn basic strategy, will I win at blackjack?',
    a:
      'No. Basic strategy makes blackjack cheap, not profitable. Under this site\'s rules — 6 decks, dealer stands ' +
      'on all 17s, blackjack pays 3:2 — perfect play still gives the house about 0.6% of every bet. What the chart ' +
      'buys you is the gap between 0.6% and the 2% or more that guessing costs: at $10 a hand and 70 hands an ' +
      'hour, about $4 an hour instead of $14 or more. You will still have losing nights. You will have fewer ' +
      'expensive ones.',
  },
  {
    q: 'Which casino game has the best odds?',
    a:
      'With perfect play, full-pay Deuces Wild video poker returns 100.76%, so the player holds a 0.76% edge; those ' +
      'machines are rare and closely watched. Among games you can actually find: 9/6 Jacks or Better at 0.46%, ' +
      '3:2 blackjack at about 0.6%, and properly played Ultimate Texas Hold\'em at about 0.5% of total money ' +
      'wagered. Published figures put the craps pass line at 1.41% and the baccarat banker bet at 1.06%. Live ' +
      'slots run about 6 to 12% depending on denomination. The order matters more than the decimals.',
  },
  {
    q: 'Is video poker really better than slots?',
    a:
      'By a wide margin, provided you read the pay table and hold the right cards. A 9/6 Jacks or Better machine ' +
      'returns 99.54%: at $1.25 a hand and 600 hands an hour it costs about $3.50 an hour. A slot keeping 10% at ' +
      '$1.20 a spin and 500 spins an hour costs about $60, seventeen times the price for the same stool. Two ' +
      'cautions: the 8/5 version of the same game returns 97.30% and costs about $20 an hour, and none of it holds ' +
      'if your holds are wrong.',
  },
  {
    q: 'What is the difference between 3:2 and 6:5 blackjack?',
    a:
      'What your blackjack pays. At 3:2 a $10 bet wins $15 on a natural; at 6:5 it wins $12. A blackjack arrives ' +
      'about one hand in 21, so that missing $3 adds about 1.4% to the house edge — turning a 0.6% game into a 2% ' +
      'game with no change in the cards, the rules or the strategy. No play adjustment recovers it. The only ' +
      'correct response to a 6:5 sign is to keep walking.',
  },
  {
    q: 'Is insurance ever the right play?',
    a:
      'Not for a basic-strategy player. Insurance is a separate bet that the dealer\'s hole card is a ten. It pays ' +
      '2:1 but wins less than one time in three, for a house edge of about 7% under these rules. "Even money" on ' +
      'your own blackjack is the same bet under a different name: declining it is worth about 1.04 bets on average ' +
      'against a guaranteed 1.00. The one exception is a card counter who knows the shoe is rich in tens. ' +
      'Otherwise: never.',
  },
  {
    q: 'Do betting systems like the Martingale work?',
    a:
      'No, and the arithmetic is short. A progression rearranges when you win and lose; it cannot change the ' +
      'expected value of a single bet, which stays negative, and no sum of negative numbers is positive. Doubling ' +
      'a $10 bet through seven straight losses means you have lost $1,270 and are now betting $1,280 to win the ' +
      'original $10. Seven-loss streaks arrive about once every 90 sequences at roulette odds. The system does not ' +
      'fail rarely. It fails on schedule.',
  },
  {
    q: 'Can a slot machine or a table be "due"?',
    a:
      'No. A slot\'s random number generator produces thousands of numbers a second and has no memory; the spin ' +
      'after a jackpot has exactly the odds the spin before it had. Cards out of a freshly shuffled shoe are no ' +
      'different. A royal flush in Jacks or Better arrives about once in 40,000 hands on average, which does not ' +
      'mean one is owed at hand 40,001. Streaks are what randomness looks like, not a signal hiding inside it.',
  },
  {
    q: 'Is card counting legal, and does it work online?',
    a:
      'Counting with your own brain is legal everywhere in the United States, though a casino is private property ' +
      'and can ask you to leave. It works because a shoe dealt deep without a reshuffle drifts rich or poor in ' +
      'tens, and a skilled counter converts that into roughly a 1% edge, with large swings and a real ' +
      'chance of being shown the door. It cannot work online or at any continuous-shuffle table: a reshuffle after ' +
      'every hand resets the count to zero, permanently.',
  },
  {
    q: 'What does it mean when the dealer has to "qualify"?',
    a:
      'In dealer-versus-player poker games the dealer needs a minimum hand before your bets settle at full stakes: ' +
      'queen-high in Three Card Poker, a pair in Ultimate Texas Hold\'em. When the dealer misses, your ante is ' +
      'paid or returned automatically no matter what you hold. About 30% of three-card dealer hands fail to ' +
      'qualify, and about 17% of seven-card hands make no pair or better. Those free wins are why Q-6-4 plays in ' +
      'Three Card Poker — by about two-thirds of a cent per dollar of ante — and Q-6-3 folds.',
  },
  {
    q: 'Should I play the side bets?',
    a:
      'Budget them as entertainment, not strategy. Side bets — Pair Plus, 21+3, Trips, Perfect Pairs — follow ' +
      'one rule: the flashier the payout column, the bigger the house edge. Typical figures run 2 to 8%, and some go ' +
      'well past that, against about 0.6% for blackjack and about 0.5% of action for well-played Ultimate Texas ' +
      'Hold\'em. Insurance is a side bet too, at about 7%. Casinos added side bets to the tables precisely because ' +
      'the main games had become such thin margins for the house.',
  },
  {
    q: 'How much bankroll should I bring?',
    a:
      'Enough that an ordinary losing streak cannot end your evening early. Rules of thumb: 40 to 50 bets for ' +
      'blackjack or the poker-pit games, 200 to 300 bets for anything high-volatility like Double Double Bonus or ' +
      'slots. The math behind them: blackjack\'s standard deviation is about 1.15 bets per hand, so over 70 hands ' +
      'at $10 one standard deviation is roughly $95, against an expected loss of about $4. If $200 feels tight at ' +
      'a $10 table, the fix is a $5 table, not more nerve.',
  },
  {
    q: 'How long before the house edge actually shows up?',
    a:
      'Longer than one night, which is why one night proves nothing. Expected loss grows in a straight line with ' +
      'hands played; the swings grow with the square root. In blackjack at about 0.6% the two cross somewhere ' +
      'around 35,000 to 40,000 hands — roughly 500 to 580 hours at a live table. Before that, luck outweighs ' +
      'skill in any single session and a terrible player can beat a perfect one all night. After it, the average ' +
      'takes over and does not let go.',
  },
  {
    q: 'Is this site real-money gambling?',
    a:
      'No. Everything here is play money: no deposits, no prizes, no accounts, no links to real-money casinos. Your ' +
      'simulated bankroll and statistics live in your own browser and have no value anywhere else. The site is ' +
      'intended for adults of legal gambling age who want to walk into a casino already knowing what each decision ' +
      'costs, and it will never pretend gambling is profitable, because the math says otherwise. If gambling has ' +
      'stopped being fun for you or someone you know, call or text 1-800-GAMBLER.',
  },
  {
    q: 'How does this site grade my play?',
    a:
      'By enumeration, not simulation or a memorized chart. The blackjack trainer runs a recursive expected-value ' +
      'engine for the rules in play; video poker evaluates all 32 ways to hold a hand against every possible ' +
      'draw; Ultimate Texas Hold\'em plays your river hand against all 990 possible dealer holdings (only its ' +
      'preflop decision is graded against the published raising chart, with the cost of a mistake estimated by ' +
      'Monte Carlo); Three Card Poker enumerates all 18,424. Pick anything but the highest-EV option and the ' +
      'difference is priced in dollars at your bet size; your running actual house edge shows the gap between ' +
      'your play and perfect play.',
  },
];

export const faq = FAQ;

function Body() {
  return (
    <>
      <p className="lede">
        These are the questions people actually ask when they start taking casino games seriously, answered in
        a paragraph each with the numbers attached. Every figure comes from this site&#39;s own engines or from
        standard, checkable casino math: what the <T k="house-edge">house edge</T> is, what the{' '}
        <T k="expected-value">expected value</T> of a decision means, and what <T k="basic-strategy">basic
        strategy</T> does and does not buy you. None of it requires taking anyone&#39;s word for it.
      </p>
      <p className="lede">
        Several answers have a longer treatment elsewhere: the <a href="/learn/blackjack">blackjack lesson</a>,
        the <a href="/learn/bankroll">bankroll lesson</a>, and the articles on{' '}
        <a href="/learn/six-five-blackjack">6:5 blackjack</a>,{' '}
        <a href="/learn/blackjack-insurance-even-money">insurance and even money</a> and{' '}
        <a href="/learn/video-poker-vs-slots">video poker versus slots</a>. If you would rather test an answer
        than read it, the <a href="/blackjack">blackjack trainer</a> grades every decision against the same math.
      </p>
      {FAQ.map(({ q, a }) => (
        <section key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </section>
      ))}
      <a className="practice-cta" href="/learn">Back to the Strategy School →</a>
    </>
  );
}

export const article: Article = {
  slug: 'faq',
  title: 'Casino Strategy FAQ: Straight Answers on House Edge, Odds and Perfect Play',
  description:
    'Sixteen plain answers with numbers: what house edge means, whether basic strategy wins, 3:2 vs 6:5, ' +
    'insurance, betting systems, counting and bankroll.',
  nav: 'FAQ',
  published: '2026-09-28',
  updated: '2026-09-28',
  readingMinutes: 8,
  faq: FAQ,
  component: Body,
};
