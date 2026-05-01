import { Reveal } from "./reveal";

export function PrivacySection() {
  return (
    <section className="privacy" id="privacy">
      <div className="container-marketing">
        <Reveal className="max-3xl">
          <div style={{ textAlign: "center" }}>
            <span className="kicker kicker-muted">A promise</span>
            <h2>We never read your emails.</h2>
            <p className="sub">
              Gone Phishin&apos; only checks the URLs in your messages. Not
              the subject. Not the sender. Not the body. Not the attachments.
              Just the links — to verify they&apos;re safe before you click.
            </p>
            <div className="privacy-bullets" style={{ textAlign: "left" }}>
              <PrivRow text="No content ever leaves your browser" />
              <PrivRow text="No tracking, no advertising" />
              <PrivRow text="Permissions limited to Gmail and Outlook" />
              <PrivRow text="Open about how it all works" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PrivRow({ text }: { text: string }) {
  return (
    <div className="priv-row">
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 5 8 14l-4-4" />
      </svg>
      <span>{text}</span>
    </div>
  );
}
