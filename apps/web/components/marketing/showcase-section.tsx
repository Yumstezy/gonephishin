import { Reveal } from "./reveal";

/**
 * Three alternating-layout feature stories. Each row has a text column
 * and a mockup column with a layered .mockup-back + .mockup-front pair
 * that animates apart on scroll (parallax-style depth effect).
 *
 * The 3 inline-SVG mockups are ported verbatim from the design source
 * (project/index.html) — email-list grid with safe/phishing pills, the
 * plain warning dialog, and the pairing-code + activity-feed surface.
 */
export function ShowcaseSection() {
  return (
    <section className="showcase" id="showcase">
      <div className="container-marketing">
        <Reveal className="intro">
          <span className="kicker">Features</span>
          <h2>Built to disappear — until it matters.</h2>
        </Reveal>

        <Reveal className="showcase-row" mockup>
          <div className="text">
            <h3>Every link, scanned the moment it lands.</h3>
            <p>
              Gone Phishin&apos; inspects URLs the second an email arrives —
              checking against the same threat database Chrome itself uses,
              plus our own catalog of look-alike domains and fake brand
              pages. You don&apos;t wait. You don&apos;t decide. The work is
              already done by the time you open your inbox.
            </p>
          </div>
          <div className="mockup-frame">
            <div className="mockups">
              <div
                className="mockup-back"
                style={{ background: "linear-gradient(135deg,#1a2942,#0f1a2b)" }}
              />
              <div className="mockup-front">
                <MockupEmailList />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="showcase-row" mockup reverse>
          <div className="text">
            <h3>One big button. No decisions.</h3>
            <p>
              When a click would have landed somewhere dangerous, Gone
              Phishin&apos; steps in with a single, plain-English warning and
              one big button to go back. No jargon, no &quot;are you
              sure,&quot; no chain of dialogs. The dangerous moment passes,
              and the day continues.
            </p>
          </div>
          <div className="mockup-frame">
            <div className="mockups">
              <div
                className="mockup-back"
                style={{ background: "linear-gradient(135deg,#2a1218,#1a0f14)" }}
              />
              <div className="mockup-front">
                <MockupWarning />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="showcase-row" mockup>
          <div className="text">
            <h3>Set it up for someone you love.</h3>
            <p>
              Generate a 6-digit code, read it to a parent or grandparent
              over the phone, and you&apos;re done. They never need an
              account. They never need to log in. You see only what&apos;s
              dangerous — never their email, never their personal life.
            </p>
          </div>
          <div className="mockup-frame">
            <div className="mockups">
              <div
                className="mockup-back"
                style={{ background: "linear-gradient(135deg,#0f2a22,#0a1a16)" }}
              />
              <div className="mockup-front">
                <MockupPairingCode />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="showcase-bottom-line" />
    </section>
  );
}

function MockupEmailList() {
  return (
    <svg
      className="mockup-svg"
      viewBox="0 0 471 637"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="471" height="637" fill="#131a26" />
      <rect x="20" y="20" width="431" height="40" rx="8" fill="#0f1521" />
      <circle cx="40" cy="40" r="5" fill="#ff5f57" />
      <circle cx="58" cy="40" r="5" fill="#febc2e" />
      <circle cx="76" cy="40" r="5" fill="#28c840" />
      <rect x="120" y="32" width="200" height="16" rx="4" fill="#131a26" stroke="#1f2735" />
      <text x="130" y="44" fill="#8a93a3" fontFamily="Geist, sans-serif" fontSize="11">mail.google.com</text>

      <g fontFamily="Geist, sans-serif">
        {/* Row 1 — SAFE */}
        <rect x="20" y="80" width="431" height="80" rx="10" fill="#131a26" stroke="#1f2735" />
        <circle cx="50" cy="120" r="16" fill="#38bdf8" />
        <text x="50" y="125" fill="white" fontSize="13" fontWeight="600" textAnchor="middle">A</text>
        <text x="80" y="115" fill="#e7ecf3" fontSize="13" fontWeight="600">Amazon</text>
        <text x="80" y="135" fill="#8a93a3" fontSize="12">Your order has shipped</text>
        <rect x="380" y="105" width="56" height="20" rx="10" fill="#0e2620" stroke="#1d4f3f" />
        <text x="408" y="119" fill="#6ee7b7" fontSize="10" fontWeight="600" textAnchor="middle">SAFE</text>

        {/* Row 2 — PHISHING */}
        <rect x="20" y="170" width="431" height="80" rx="10" fill="#2a1418" stroke="#5a1a22" />
        <circle cx="50" cy="210" r="16" fill="#3a1218" />
        <text x="50" y="215" fill="#fca5a5" fontSize="13" fontWeight="600" textAnchor="middle">P</text>
        <text x="80" y="205" fill="#e7ecf3" fontSize="13" fontWeight="600">&quot;PayPaI Security&quot;</text>
        <text x="80" y="225" fill="#8a93a3" fontSize="12">URGENT: Verify your account</text>
        <rect x="362" y="195" width="74" height="20" rx="10" fill="#3a1218" stroke="#5a1a22" />
        <text x="399" y="209" fill="#fca5a5" fontSize="10" fontWeight="600" textAnchor="middle">PHISHING</text>

        {/* Row 3 — SAFE */}
        <rect x="20" y="260" width="431" height="80" rx="10" fill="#131a26" stroke="#1f2735" />
        <circle cx="50" cy="300" r="16" fill="#38bdf8" />
        <text x="50" y="305" fill="white" fontSize="13" fontWeight="600" textAnchor="middle">S</text>
        <text x="80" y="295" fill="#e7ecf3" fontSize="13" fontWeight="600">Sarah (your daughter)</text>
        <text x="80" y="315" fill="#8a93a3" fontSize="12">Photos from the trip!</text>
        <rect x="380" y="285" width="56" height="20" rx="10" fill="#0e2620" stroke="#1d4f3f" />
        <text x="408" y="299" fill="#6ee7b7" fontSize="10" fontWeight="600" textAnchor="middle">SAFE</text>

        {/* Row 4 — PHISHING */}
        <rect x="20" y="350" width="431" height="80" rx="10" fill="#2a1418" stroke="#5a1a22" />
        <circle cx="50" cy="390" r="16" fill="#3a1218" />
        <text x="50" y="395" fill="#fca5a5" fontSize="13" fontWeight="600" textAnchor="middle">M</text>
        <text x="80" y="385" fill="#e7ecf3" fontSize="13" fontWeight="600">&quot;Microsoft Support&quot;</text>
        <text x="80" y="405" fill="#8a93a3" fontSize="12">Your computer is at risk</text>
        <rect x="362" y="375" width="74" height="20" rx="10" fill="#3a1218" stroke="#5a1a22" />
        <text x="399" y="389" fill="#fca5a5" fontSize="10" fontWeight="600" textAnchor="middle">PHISHING</text>

        {/* Row 5 — SAFE */}
        <rect x="20" y="440" width="431" height="80" rx="10" fill="#131a26" stroke="#1f2735" />
        <circle cx="50" cy="480" r="16" fill="#38bdf8" />
        <text x="50" y="485" fill="white" fontSize="13" fontWeight="600" textAnchor="middle">W</text>
        <text x="80" y="475" fill="#e7ecf3" fontSize="13" fontWeight="600">Wells Fargo</text>
        <text x="80" y="495" fill="#8a93a3" fontSize="12">Statement ready to view</text>
        <rect x="380" y="465" width="56" height="20" rx="10" fill="#0e2620" stroke="#1d4f3f" />
        <text x="408" y="479" fill="#6ee7b7" fontSize="10" fontWeight="600" textAnchor="middle">SAFE</text>
      </g>
    </svg>
  );
}

function MockupWarning() {
  return (
    <svg
      className="mockup-svg"
      viewBox="0 0 471 637"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="gradWarn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0e10" />
          <stop offset="1" stopColor="#131a26" />
        </linearGradient>
      </defs>
      <rect width="471" height="637" fill="url(#gradWarn)" />
      <rect x="60" y="160" width="351" height="320" rx="20" fill="#131a26" stroke="#1f2735" strokeWidth="1" />
      <circle cx="235" cy="240" r="40" fill="#3a1218" />
      <path d="M235 218 v32 M235 262 h.01" stroke="#fca5a5" strokeWidth="6" strokeLinecap="round" />
      <text x="235" y="320" fill="#e7ecf3" fontFamily="Geist,sans-serif" fontSize="22" fontWeight="600" textAnchor="middle">Dangerous link</text>
      <text x="235" y="350" fill="#8a93a3" fontFamily="Geist,sans-serif" fontSize="14" textAnchor="middle">This looks like a fake PayPal page.</text>
      <text x="235" y="370" fill="#8a93a3" fontFamily="Geist,sans-serif" fontSize="14" textAnchor="middle">Click &quot;Go back&quot; to return safely.</text>
      <rect x="100" y="400" width="271" height="48" rx="10" fill="#e7ecf3" />
      <text x="235" y="430" fill="#131a26" fontFamily="Geist,sans-serif" fontSize="15" fontWeight="600" textAnchor="middle">Go back</text>
      <text x="235" y="475" fill="#6b7383" fontFamily="Geist,sans-serif" fontSize="12" textAnchor="middle">Ignore (not recommended)</text>
    </svg>
  );
}

function MockupPairingCode() {
  return (
    <svg
      className="mockup-svg"
      viewBox="0 0 471 637"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="471" height="637" fill="#131a26" />
      <text x="60" y="80" fill="#38bdf8" fontFamily="Geist,sans-serif" fontSize="11" fontWeight="600" letterSpacing="2">PAIRING CODE FOR MOM</text>
      <text x="60" y="130" fill="#e7ecf3" fontFamily="Geist,sans-serif" fontSize="26" fontWeight="600">Read this to her on the phone.</text>

      <g fontFamily="Geist,sans-serif" fontSize="48" fontWeight="600" fill="#e7ecf3" letterSpacing="-1">
        <rect x="60" y="170" width="60" height="80" rx="10" fill="#0f1521" stroke="#1f2735" />
        <text x="90" y="226" textAnchor="middle">4</text>
        <rect x="130" y="170" width="60" height="80" rx="10" fill="#0f1521" stroke="#1f2735" />
        <text x="160" y="226" textAnchor="middle">9</text>
        <rect x="200" y="170" width="60" height="80" rx="10" fill="#0f1521" stroke="#1f2735" />
        <text x="230" y="226" textAnchor="middle">2</text>
        <text x="280" y="226" fill="#2a3243" textAnchor="middle">—</text>
        <rect x="310" y="170" width="60" height="80" rx="10" fill="#0f1521" stroke="#1f2735" />
        <text x="340" y="226" textAnchor="middle">7</text>
        <rect x="380" y="170" width="60" height="80" rx="10" fill="#0f1521" stroke="#1f2735" />
        <text x="410" y="226" textAnchor="middle">1</text>
      </g>

      <text x="60" y="290" fill="#6b7383" fontFamily="Geist,sans-serif" fontSize="13">Code expires in 23h 47m</text>
      <line x1="60" y1="330" x2="411" y2="330" stroke="#1f2735" />
      <text x="60" y="370" fill="#38bdf8" fontFamily="Geist,sans-serif" fontSize="11" fontWeight="600" letterSpacing="2">RECENT ACTIVITY</text>

      <g fontFamily="Geist,sans-serif">
        <circle cx="76" cy="410" r="6" fill="#dc2626" />
        <text x="100" y="408" fill="#e7ecf3" fontSize="13" fontWeight="500">Stopped a fake PayPal email</text>
        <text x="100" y="426" fill="#6b7383" fontSize="11">For Mom · 2 hours ago</text>

        <circle cx="76" cy="460" r="6" fill="#dc2626" />
        <text x="100" y="458" fill="#e7ecf3" fontSize="13" fontWeight="500">Stopped a fake USPS notice</text>
        <text x="100" y="476" fill="#6b7383" fontSize="11">For Mom · Yesterday</text>

        <circle cx="76" cy="510" r="6" fill="#16a34a" />
        <text x="100" y="508" fill="#e7ecf3" fontSize="13" fontWeight="500">Mom installed the extension</text>
        <text x="100" y="526" fill="#6b7383" fontSize="11">3 days ago</text>
      </g>
    </svg>
  );
}
