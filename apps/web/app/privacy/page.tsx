import Link from "next/link";
import { InlineSvg } from "@/components/marketing/inline-svg";

export const metadata = {
  title: "Privacy — Gone Phishin'",
  description:
    "What Gone Phishin' collects, why, and how long we keep it. We don't read your email.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="legal-nav">
        <Link href="/" className="legal-back" aria-label="Back to home">
          <InlineSvg
            src="/fish.svg"
            className="brand-mark"
            aria-label="Gone Phishin'"
          />
          <span>Gone Phishin&apos;</span>
        </Link>
        <Link href="/" className="legal-back-link">
          ← Back home
        </Link>
      </header>

      <article className="legal-doc">
        <p className="kicker">Last updated April 29, 2026</p>
        <h1>Privacy policy</h1>
        <p className="lead">
          Gone Phishin&apos; is a free Chrome extension that warns you about
          phishing or malware links inside Gmail and Outlook. This page is the
          plain-English version: what we collect, why, and how long we keep it.
        </p>

        <h2>What Gone Phishin&apos; is</h2>
        <p>There are two parts:</p>
        <ul>
          <li>
            The Chrome extension that runs in your browser when you open Gmail
            or Outlook. It scans the URLs of the links displayed in your inbox.
          </li>
          <li>
            This website, where caregivers can sign in to set the extension up
            for a family member, view a log of blocked threats, and revoke
            access.
          </li>
        </ul>
        <p>
          You only need the website if you want to set the extension up for
          someone else (for example, an adult child setting it up for a
          parent). If you are using the extension for yourself, you can either
          use the &ldquo;Sign in for myself&rdquo; option from the popup or
          skip sign-in entirely — the extension still warns you about
          dangerous links either way.
        </p>

        <h2>What we collect</h2>
        <h3>From inside your browser</h3>
        <p>
          The extension reads the URLs of the links displayed on the Gmail /
          Outlook page you have open. For each link we have not already
          classified, the URL is sent to the Gone Phishin&apos; API, which
          forwards the URL to Google&apos;s{" "}
          <a
            href="https://developers.google.com/safe-browsing/v4/lookup-api"
            target="_blank"
            rel="noreferrer"
          >
            Safe Browsing Lookup API
          </a>
          . The API returns a verdict (safe, sketchy, or dangerous), which is
          cached locally in your browser.
        </p>
        <p>
          We do <strong>not</strong> read or upload the contents of your
          emails. We do not see attachments, subject lines, sender addresses,
          recipient lists, message bodies, or any other email metadata. The
          only thing we look at is the clickable URLs the page renders in
          front of you — the same URLs your browser already shows in the link
          preview at the bottom-left corner of the window.
        </p>
        <p>The extension does not store browsing history.</p>

        <h3>From the web app</h3>
        <p>If you sign into the web app, we store:</p>
        <ul>
          <li>
            An identifier from our authentication provider (Clerk) that links
            your sign-in to your account, plus the email address you signed
            in with.
          </li>
          <li>
            The &ldquo;circles&rdquo; you create. A circle is a label for a
            person whose browser is paired with the extension (for example,
            &ldquo;Mom&apos;s laptop&rdquo;). Each circle stores the label,
            whether it&apos;s self-managed or caregiver-paired, and a database
            identifier.
          </li>
          <li>
            A log of <em>danger events</em> — when the extension warns about a
            suspicious or dangerous link, it records the <strong>domain</strong>{" "}
            of that link (not the full URL), the kind of threat, and what the
            user did (warning shown, went back, continued anyway).
          </li>
          <li>
            For caregiver pairing: a short-lived 6-digit pairing code (5-minute
            TTL) and a long-lived bearer token that authorizes the paired
            browser to log events to your dashboard. Tokens can be revoked from
            the Settings page.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> store the full URLs of the links the
          extension scans on our servers. The threat log keeps the domain
          only.
        </p>

        <h2>What we do not collect</h2>
        <ul>
          <li>Email contents, subjects, attachments, sender or recipient information.</li>
          <li>Browsing history or pages you visit outside Gmail / Outlook.</li>
          <li>Keystrokes, form data, passwords, or anything you type into a webpage.</li>
          <li>Cookies set by other sites.</li>
          <li>Device identifiers, advertising identifiers, or fingerprinting signals.</li>
          <li>Geolocation, microphone, camera, or any other sensor data.</li>
          <li>Personal information beyond the email address you sign in with.</li>
        </ul>

        <h2>How we use it</h2>
        <p>The data above is used only to:</p>
        <ol>
          <li>Detect whether a link in your inbox is known to be phishing or malware.</li>
          <li>
            Show the threat history on your dashboard so you can see what&apos;s
            been blocked for you (or for the family member you set up).
          </li>
          <li>Authenticate you to the web app and the paired browser.</li>
        </ol>
        <p>
          We do not sell, rent, share, or trade your data. We do not use your
          data to train AI models. We do not show advertising.
        </p>

        <h2>Third parties</h2>
        <p>
          The extension and web app rely on these third parties to operate.
          They each have their own privacy practices.
        </p>
        <ul>
          <li>
            <strong>Google Safe Browsing</strong> — receives the URLs we scan to
            return a verdict.{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              policy
            </a>
          </li>
          <li>
            <strong>Clerk</strong> — handles sign-in for the web app.{" "}
            <a href="https://clerk.com/legal/privacy" target="_blank" rel="noreferrer">
              policy
            </a>
          </li>
          <li>
            <strong>Vercel</strong> and <strong>Neon</strong> — host the web app
            and database.{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
              Vercel
            </a>{" "}
            ·{" "}
            <a href="https://neon.tech/privacy-policy" target="_blank" rel="noreferrer">
              Neon
            </a>
          </li>
        </ul>

        <h2>Retention</h2>
        <ul>
          <li>Cached link verdicts in your browser: held for up to 24 hours, then refreshed.</li>
          <li>
            Threat-log rows in the dashboard: kept indefinitely for the
            circles you own. Deleting a circle from Settings removes its log
            permanently.
          </li>
          <li>Pairing codes: expire after 5 minutes.</li>
          <li>Extension tokens: kept until you revoke them from Settings.</li>
          <li>
            Account record: kept until you ask us to delete it (see below).
            Deleting your account removes all of your circles, threat logs, and
            tokens.
          </li>
        </ul>

        <h2>Your choices</h2>
        <ul>
          <li>
            You can use the extension entirely without signing in. It still
            warns you about dangerous links; it just won&apos;t keep a history.
          </li>
          <li>
            You can revoke a paired browser at any time from the web
            app&apos;s Settings page.
          </li>
          <li>
            You can delete a circle at any time from the Settings page; this
            removes its threat-log history.
          </li>
          <li>
            To delete your account and all associated data, email{" "}
            <a href="mailto:privacy@gonephishin.com">privacy@gonephishin.com</a>.
          </li>
        </ul>

        <h2>Children</h2>
        <p>
          Gone Phishin&apos; is not directed at children under 13. We do not
          knowingly collect data from children under 13. If you believe a
          child has provided us with personal information, contact us and we
          will delete it.
        </p>

        <h2>Security</h2>
        <p>
          Data is transmitted over HTTPS. The database is encrypted at rest by
          our hosting provider. Pairing codes and tokens are random,
          single-use (codes) or revocable (tokens). We do not have access to
          your email account itself — the extension only reads the links
          rendered on the page you are viewing.
        </p>

        <h2>Changes</h2>
        <p>
          If we change this policy, we will update the &ldquo;Last
          updated&rdquo; date and post the new version at this URL. For
          material changes, we will note the change in the extension popup.
        </p>

        <h2>Contact</h2>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:privacy@gonephishin.com">privacy@gonephishin.com</a>
          </li>
          <li>
            Web: <Link href="/">gonephishin.com</Link>
          </li>
        </ul>
      </article>
    </>
  );
}
