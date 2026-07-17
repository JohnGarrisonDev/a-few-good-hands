import { CONTACT_EMAIL, COPYRIGHT_OWNER, SITE_NAME, SITE_URL } from '../config';

export function PrivacyPage() {
  return (
    <div className="lobby legal-page">
      <h1>Privacy Policy</h1>
      <p>
        This policy describes what information is (and isn&#39;t) collected when you use {SITE_NAME} at{' '}
        <a href={SITE_URL}>{SITE_URL}</a>, and how it&#39;s used. Short version: the site itself collects nothing
        about you, stores your play data only in your own browser, and — like most free sites — may show ads
        served by Google, which uses cookies as described below.
      </p>

      <section>
        <h2>Information we collect directly: none</h2>
        <p>
          {SITE_NAME} has no user accounts, no sign-up forms, no newsletters and no server-side database. We do
          not collect, store or process your name, email address, or any personal information. Your simulated
          bankroll, settings and session statistics are stored exclusively in your own browser&#39;s{' '}
          <code>localStorage</code> and never leave your device. You can erase them at any time by clearing your
          browser&#39;s site data for this domain.
        </p>
      </section>

      <section>
        <h2>Advertising and cookies (Google AdSense)</h2>
        <p>
          This site may display advertisements served by Google AdSense. Third-party vendors, including Google,
          use cookies to serve ads based on your prior visits to this website or other websites. Google&#39;s use
          of advertising cookies enables it and its partners to serve ads to you based on your visits to this
          site and/or other sites on the Internet.
        </p>
        <p>
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" rel="noopener nofollow" target="_blank">
            Google Ads Settings
          </a>
          . Alternatively, you can opt out of some third-party vendors&#39; use of cookies for personalized
          advertising at{' '}
          <a href="https://www.aboutads.info" rel="noopener nofollow" target="_blank">
            www.aboutads.info
          </a>
          . For details on how Google uses information from sites that use its services, see{' '}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener nofollow" target="_blank">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Hosting logs</h2>
        <p>
          The site is hosted on Microsoft Azure. Like virtually all web hosts, Azure may record standard,
          transient technical logs (such as IP address and user agent) for the purpose of operating and securing
          the service. We do not use these logs to identify visitors.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          This site simulates casino games and is intended for adults of legal gambling age (21+ in most US
          jurisdictions, 18+ elsewhere). It is not directed at children and knowingly collects no information
          from anyone, children included.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          If this policy changes, the updated version will be posted at this address. Questions about privacy on
          this site can be sent to {COPYRIGHT_OWNER} at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <p>
        <a href="/legal">Legal &amp; disclaimers</a> · <a href="/">← Back to the games</a>
      </p>
    </div>
  );
}
