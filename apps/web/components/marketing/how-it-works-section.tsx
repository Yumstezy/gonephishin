import { Reveal } from "./reveal";

export function HowItWorksSection() {
  return (
    <section className="band how-band" id="how-it-works">
      <div className="container-marketing">
        <div className="max-3xl">
          <Reveal className="section-intro" delay={undefined}>
            <span className="kicker">How it works</span>
            <h2>Three steps. No technical setup.</h2>
          </Reveal>
          <div className="steps">
            <Reveal className="step-row">
              <div className="step-num">01</div>
              <div className="step-content">
                <h3>Install Gone Phishin&apos;.</h3>
                <p>One click on the Chrome Web Store. No setup. No account.</p>
              </div>
            </Reveal>
            <Reveal className="step-row" delay={1}>
              <div className="step-num">02</div>
              <div className="step-content">
                <h3>Browse normally.</h3>
                <p>
                  Open Gmail or Outlook the way you always do. We check every
                  link silently in the background.
                </p>
              </div>
            </Reveal>
            <Reveal className="step-row" delay={2}>
              <div className="step-num">03</div>
              <div className="step-content">
                <h3>We catch the bad ones.</h3>
                <p>
                  If you almost click on something dangerous, a warning
                  appears with one big button to go back.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
