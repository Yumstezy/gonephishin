import { Reveal } from "./reveal";

/**
 * Three value-prop columns separated by vertical dividers on desktop,
 * stacked on mobile. Numbered "01/02/03" mono labels above each.
 */
export function ValuePropsSection() {
  return (
    <section className="band" id="features">
      <div className="container-marketing">
        <Reveal className="section-intro">
          <span className="kicker">What it does</span>
          <h2>Quietly, in the background — until something is wrong.</h2>
        </Reveal>
        <div className="max-6xl">
          <div className="value-grid">
            <Reveal className="value-col">
              <div className="num">01</div>
              <h3>Every link, checked the moment it lands.</h3>
              <p>
                Inspected against the same threat database Chrome itself uses,
                plus our own checks for fake brand pages and look-alike
                domains.
              </p>
            </Reveal>
            <Reveal className="value-col" delay={1}>
              <div className="num">02</div>
              <h3>A clear warning, in plain English.</h3>
              <p>
                When a link looks dangerous, the click is intercepted. A
                warning appears with one big button to go back — no jargon,
                no decisions.
              </p>
            </Reveal>
            <Reveal className="value-col" delay={2}>
              <div className="num">03</div>
              <h3>Set it up for someone you love.</h3>
              <p>
                Pair Gone Phishin&apos; with a parent or grandparent in under
                a minute. They never need an account. You only see what&apos;s
                dangerous.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
