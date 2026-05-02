import Link from "next/link";
import { InlineSvg } from "@/components/marketing/inline-svg";

export const metadata = {
  title: "Support — Gone Phishin'",
  description:
    "Get help with Gone Phishin'. Common questions, what to do if a link is misflagged, and how to reach a human.",
};

export default function SupportPage() {
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
        <p className="kicker">Help & contact</p>
        <h1>Support</h1>
        <p className="lead">
          Need a hand with Gone Phishin&apos;? Most questions have an answer
          below. If yours doesn&apos;t, email{" "}
          <a href="mailto:support@gonephishin.tech">support@gonephishin.tech</a>{" "}
          and a real human will get back to you within a couple of business
          days.
        </p>

        <h2>Quick fixes</h2>

        <h3>The extension isn&apos;t flagging anything in Gmail / Outlook</h3>
        <ol>
          <li>
            Open the popup (fish icon in the toolbar). The status row should
            say <strong>&ldquo;Active · last check Xs ago&rdquo;</strong>{" "}
            after you scroll a Gmail / Outlook tab.
          </li>
          <li>
            If it says <strong>&ldquo;Can&apos;t reach our server&rdquo;</strong>{" "}
            — your network is blocking us. Try a different network or check
            your firewall / VPN.
          </li>
          <li>
            If it says <strong>&ldquo;Waiting for an inbox&rdquo;</strong>{" "}
            after you&apos;ve opened Gmail — refresh the Gmail tab once. The
            extension hooks into the page on load.
          </li>
          <li>
            Make sure the extension is enabled at{" "}
            <code>chrome://extensions/</code>.
          </li>
        </ol>

        <h3>A safe link is being flagged as dangerous</h3>
        <p>
          We use Google&apos;s Safe Browsing list as the source of truth for
          phishing / malware. False positives are rare but real. If a link
          looks legitimate to you and we&apos;re flagging it:
        </p>
        <ul>
          <li>
            Click <strong>Continue anyway</strong> in the warning modal — we
            never block; we only ask.
          </li>
          <li>
            Email <a href="mailto:support@gonephishin.tech">support@gonephishin.tech</a>{" "}
            with the domain so we can investigate.
          </li>
        </ul>

        <h3>A dangerous link isn&apos;t being flagged</h3>
        <p>
          Brand-new phishing pages can take a few hours to land in the Safe
          Browsing list. If you spot one we missed, please send the URL to{" "}
          <a href="mailto:support@gonephishin.tech">support@gonephishin.tech</a>{" "}
          — we&apos;ll forward it to Google and update our heuristics if a
          pattern emerges.
        </p>

        <h3>I can&apos;t pair the extension to my dashboard</h3>
        <ul>
          <li>
            The 6-digit code expires in 5 minutes. Generate a fresh one from
            the circle&apos;s page if it&apos;s timed out.
          </li>
          <li>
            For a self-mode circle (&ldquo;For me&rdquo;), you don&apos;t need
            a code — open the popup → <strong>Connect to my dashboard</strong>{" "}
            → <strong>This is my browser</strong>.
          </li>
          <li>
            If you accidentally paired your own browser to a caregiver
            circle, click <strong>Unpair this browser</strong> in the popup
            and start over.
          </li>
        </ul>

        <h3>I want to delete my account</h3>
        <p>
          Email{" "}
          <a href="mailto:privacy@gonephishin.tech">privacy@gonephishin.tech</a>{" "}
          and we&apos;ll delete your account, all your circles, threat logs,
          and tokens within a few business days. See the{" "}
          <Link href="/privacy">privacy policy</Link> for the full retention
          rundown.
        </p>

        <h2>Privacy questions</h2>
        <p>
          Read the <Link href="/privacy">privacy policy</Link> first — it
          covers exactly what we collect (and don&apos;t). For anything not
          answered there, email{" "}
          <a href="mailto:privacy@gonephishin.tech">privacy@gonephishin.tech</a>.
        </p>

        <h2>Contact</h2>
        <ul>
          <li>
            General help:{" "}
            <a href="mailto:support@gonephishin.tech">support@gonephishin.tech</a>
          </li>
          <li>
            Privacy / data deletion:{" "}
            <a href="mailto:privacy@gonephishin.tech">privacy@gonephishin.tech</a>
          </li>
          <li>
            Security disclosures:{" "}
            <a href="mailto:security@gonephishin.tech">security@gonephishin.tech</a>
          </li>
        </ul>
      </article>
    </>
  );
}
