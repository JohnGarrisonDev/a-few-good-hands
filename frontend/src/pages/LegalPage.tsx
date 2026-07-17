import { COPYRIGHT_OWNER, COPYRIGHT_YEAR, SITE_NAME, SITE_URL } from '../config';

export function LegalPage() {
  return (
    <div className="lobby legal-page">
      <h1>Legal, Privacy &amp; Disclaimers</h1>

      <section>
        <h2>What this site is (and isn&#39;t)</h2>
        <p>
          {SITE_NAME} is a <strong>free educational strategy trainer</strong> for casino table games. All chips,
          bankrolls and bets on this site are simulated play money with <strong>no real-world value</strong>. This
          site does <strong>not</strong> offer real-money gambling, does not accept wagers or deposits of any kind,
          and does not award prizes, cash or anything of value. Nothing here is an inducement to gamble.
        </p>
        <p>
          The simulated games are intended for adults of <strong>legal gambling age</strong> (21+ in most US
          jurisdictions, 18+ elsewhere). This site is not directed at minors.
        </p>
        <p>
          Strategy content is provided for education and entertainment. Expected-value calculations describe
          long-run mathematical averages under the stated rules; they are not a promise of results at any real
          casino, whose rules and pay tables may differ. Gambling involves risk — if you choose to gamble with real
          money elsewhere, never bet more than you can afford to lose.
        </p>
        <p>
          <strong>Problem gambling help (US):</strong> call or text{' '}
          <a href="tel:1-800-522-4700">1-800-GAMBLER (1-800-522-4700)</a> or visit{' '}
          <a href="https://www.ncpgambling.org" rel="noopener nofollow" target="_blank">
            ncpgambling.org
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Copyright</h2>
        <p>
          © {COPYRIGHT_YEAR} {COPYRIGHT_OWNER}. All rights reserved. The {SITE_NAME} name, logo, site design, text,
          and software are the property of {COPYRIGHT_OWNER}. The source code is published under the MIT License;
          the license text in the repository governs use of the code.
        </p>
      </section>

      <section>
        <h2>Trademarks</h2>
        <p>
          &quot;Ultimate Texas Hold&#39;em&quot; and &quot;Three Card Poker&quot; are trademarks of their respective
          owners (Bally Gaming, Inc. / Light &amp; Wonder, Inc.). These names are used on this site only to
          <em> describe and teach the publicly known rules and mathematics of those games</em> (nominative use).
          {` ${SITE_NAME} `} is not affiliated with, endorsed by, or sponsored by Light &amp; Wonder, Bally Gaming,
          or any casino or game manufacturer. All other trademarks are the property of their respective owners.
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          The site collects no personal information directly; play data lives only in your own browser, and ads
          may be served by Google AdSense using cookies. The full details, including how to opt out of
          personalized advertising, are in the dedicated <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2>Terms of use</h2>
        <p>
          This site and its content are provided <strong>&quot;as is&quot;, without warranty of any kind</strong>,
          express or implied, including fitness for a particular purpose or accuracy of results. To the maximum
          extent permitted by law, {COPYRIGHT_OWNER} is not liable for any damages arising from use of this site,
          including any gambling losses incurred anywhere. By using the site you accept these terms. The canonical
          version of this site lives at <a href={SITE_URL}>{SITE_URL}</a>.
        </p>
      </section>

      <p>
        <a href="/">← Back to the games</a>
      </p>
    </div>
  );
}
