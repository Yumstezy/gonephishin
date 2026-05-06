import Link from "next/link";
import { InlineSvg } from "./inline-svg";
import { Reveal } from "./reveal";

/**
 * Hero — pill eyebrow, sky-tinted wordmark SVG, headline with primary
 * accent on the verb, subhead, two CTAs, and an email mockup with a
 * floating warning card on the right. Decorative fish-line watermark
 * bleeds in from the upper-right corner; soft sky glow sits behind.
 */
export function Hero() {
  return (
    <section className="hero">
      <span className="hero-glow" aria-hidden="true" />
      <span className="hero-watermark">
        <InlineSvg src="/fish-line.svg" />
      </span>

      <div className="container-marketing">
        <div className="hero-grid">
          <Reveal className="hero-copy">
            <span className="eyebrow-pill">
              <span className="dot" />
              Free Chrome extension · Gmail &amp; Outlook
            </span>
            <span className="hero-wordmark">
              <InlineSvg src="/wordmark.svg" label="Gone Phishin'" />
            </span>
            <h1>
              Phishing scams, <em>stopped at the door.</em>
            </h1>
            <p className="sub">
              We watch the links in your inbox and warn you before you click
              anything that could steal your password, your money, or your
              identity.
            </p>
            <div className="ctas">
              <a
                href="https://chromewebstore.google.com/detail/gone-phishin/ifckleibjeadbcebapahhahhleoifofb"
                className="btn btn-primary btn-lg"
                target="_blank"
                rel="noreferrer"
              >
                Install free
              </a>
              <Link href="#how-it-works" className="btn btn-ghost">
                See how it works
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal className="mockup-wrap" delay={2}>
            <HeroMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="mockup">
      <div className="browser-chrome">
        <div className="traffic">
          <span /><span /><span />
        </div>
        <div className="addr">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          mail.google.com
        </div>
        <div style={{ width: 60 }} />
      </div>
      <div className="gmail-bar">
        <span className="label-pill">Inbox</span>
        <span style={{ fontSize: "12.5px" }}>3:42 PM</span>
      </div>
      <div className="email-body">
        <div className="email-subject">Action Required: Verify Your Account</div>
        <div className="email-meta">
          <div className="email-avatar">P</div>
          <div className="email-from">
            <span className="name">PayPal Service</span>
            <span className="addr-from">service@paypa1-secure.com</span>
          </div>
        </div>
        <div className="email-text">
          <p>Dear customer,</p>
          <p>
            We&apos;ve detected unusual activity on your PayPal account. For
            your protection, please{" "}
            <span className="danger-link">verify your account here</span>{" "}
            within 24 hours, or your account will be temporarily suspended.
          </p>
          <p className="signoff">— PayPal Security Team</p>
        </div>

        <div className="warning-card" role="alertdialog" aria-label="Phishing warning">
          <div className="head">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Dangerous link
          </div>
          <div className="body">
            This looks like a <strong>fake PayPal page</strong>. Click{" "}
            <strong>Go back</strong> to return safely.
          </div>
          <div className="actions">
            <button className="go-back" type="button">Go back</button>
            <button className="ignore" type="button">Ignore</button>
          </div>
        </div>
      </div>
    </div>
  );
}
