import { CONTACT_EMAIL, SITE_NAME } from '../config';

export function ContactPage() {
  return (
    <div className="lobby legal-page">
      <h1>Contact</h1>
      <p>
        {SITE_NAME} is run by one person, and mail genuinely gets read. The fastest way to reach the site is
        email:
      </p>
      <p>
        <strong>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </strong>
      </p>

      <section>
        <h2>Good reasons to write</h2>
        <p>
          <strong>Found a math error?</strong> Please include the game, the exact cards involved and the grading
          you disagree with — every expected-value claim on this site is checkable, and reports like this get top
          priority. <strong>Found a bug?</strong> A screenshot and your browser name usually make it fixable the
          same week. <strong>Want a game, pay table or rule variation added?</strong> Suggestions steer the
          roadmap. Feedback on the <a href="/learn">Strategy School</a> lessons — especially anything that
          confused you — is just as welcome.
        </p>
      </section>

      <section>
        <h2>A note on gambling help</h2>
        <p>
          This site teaches strategy for entertainment and education; it can&#39;t help with a gambling problem,
          but these people can, free and confidentially: call or text <strong>1-800-GAMBLER</strong>{' '}
          (1-800-522-4700) in the US, or visit{' '}
          <a href="https://www.ncpgambling.org" rel="noopener nofollow" target="_blank">
            ncpgambling.org
          </a>
          .
        </p>
      </section>

      <p>
        <a href="/">← Back to the games</a>
      </p>
    </div>
  );
}
