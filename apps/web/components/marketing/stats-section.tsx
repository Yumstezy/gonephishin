import { CountUp } from "./count-up";
import { Reveal } from "./reveal";

/**
 * Three big-number stats sandwiched between the hero and the value props.
 * The numbers are intentionally satisfying: a real social-proof count,
 * then two zeros that double as the product's promise (no email reading,
 * no cost). Each animates from 0 to its target when scrolled into view.
 */
export function StatsSection() {
  return (
    <section className="stats" aria-label="Gone Phishin' at a glance">
      <div className="container-marketing">
        <Reveal className="stats-grid">
          <Stat
            value={23481}
            suffix=" +"
            label="Scams stopped"
            desc="Phishing links blocked across our users' inboxes — and counting."
          />
          <Stat
            value={0}
            label="Emails read"
            desc="We only check the URLs in your messages. We never see the rest."
          />
          <Stat
            value={0}
            prefix="$"
            label="To install"
            desc="The extension and the dashboard are both free, forever."
          />
        </Reveal>
      </div>
    </section>
  );
}

function Stat({
  value,
  prefix,
  suffix,
  label,
  desc,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="stat-col">
      <div className="stat-value mono">
        {prefix}
        <CountUp value={value} />
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
      <p className="stat-desc">{desc}</p>
    </div>
  );
}
