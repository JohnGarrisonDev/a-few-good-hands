import { COPYRIGHT_OWNER, SITE_NAME } from '../config';

export function AboutPage() {
  return (
    <div className="lobby legal-page">
      <h1>About {SITE_NAME}</h1>
      <p>
        {SITE_NAME} is a free, play-money casino strategy trainer built and maintained by {COPYRIGHT_OWNER}, an
        independent software developer. There are no accounts, no deposits, no prizes and no real-money gambling
        anywhere on the site — just the games, the math, and honest feedback about how well you play them.
      </p>

      <section>
        <h2>Why this site exists</h2>
        <p>
          Most casino-strategy resources hand you a chart and wish you luck. The problem is that reading a chart
          and executing it under pressure are different skills — and when you get a hand wrong at a real table,
          nobody tells you. This site closes that loop. You play exactly as you would in a casino, and every
          decision is checked against the actual mathematics of the game the moment you make it. Mistakes are
          priced in dollars, not scolded, and your running &quot;actual house edge&quot; shows you the gap between
          how you play and how the game can be played.
        </p>
      </section>

      <section>
        <h2>Where the numbers come from</h2>
        <p>
          Nothing here is copied from a book — every grade is computed. The blackjack trainer runs a full
          recursive expected-value engine for the rules dealt (dealer stands on all 17s, double after split,
          blackjack pays 3:2) using an infinite-deck model, which matches published six-deck basic strategy in
          every cell but two razor-thin soft doubles and puts the house edge at about 0.6%. Video poker holds
          are graded exactly, by evaluating all 32 ways to hold a hand against every possible draw. Ultimate
          Texas Hold&#39;em river and flop decisions enumerate every dealer hand exactly (990 on the river);
          only the preflop EV estimate is a Monte Carlo sample, and the trainer says so on screen. Three Card
          Poker enumerates all 18,424 dealer hands. The strategy charts in the{' '}
          <a href="/learn">Strategy School</a> are generated live by the same engines that grade your play, so
          what you study and what you&#39;re tested on can never disagree.
        </p>
      </section>

      <section>
        <h2>What this site will never do</h2>
        <p>
          It will never take a wager, never award anything of value, never link to a real-money casino, and never
          pretend gambling is profitable. The honest message of the math is the opposite: every game here has a
          house edge, and the point of training is to know exactly how small you can make it — and exactly what
          the games cost — before you decide to play anything for real. If gambling has stopped being fun for you
          or someone you know, call or text 1-800-GAMBLER.
        </p>
      </section>

      <p>
        Questions or corrections? <a href="/contact">Get in touch</a>.
      </p>
      <p>
        <a href="/">← Back to the games</a>
      </p>
    </div>
  );
}
