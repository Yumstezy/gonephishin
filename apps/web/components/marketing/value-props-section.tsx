import { FleuronTriangle } from "./ornament";

/**
 * Three value-props as columns on a parchment shelf — each with a Roman
 * numeral, a label in small caps, and editorial copy.
 */
export function ValuePropsSection() {
  const items = [
    {
      num: "I",
      label: "On Watch",
      title: "Catches dangerous links.",
      desc: "Every link is checked, in real time, against the same threat list Chrome itself uses — plus our own detection for fake brand pages and look-alike domains.",
    },
    {
      num: "II",
      label: "On Time",
      title: "Warns before you click.",
      desc: "If a link looks dangerous, the click is intercepted and a clear warning appears in plain English, with a single large button to go back safely.",
    },
    {
      num: "III",
      label: "On Behalf",
      title: "For someone you love.",
      desc: "Set Gone Phishin' up for a parent or grandparent in a phone call. They never need an account. You see only what's dangerous — never what they read.",
    },
  ];

  return (
    <section className="relative border-y border-border bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-20 max-w-2xl">
          <p className="mb-4 font-mono-display text-[11px] uppercase tracking-[0.3em] text-primary">
            Three Reasons
          </p>
          <h2 className="font-display text-[44px] leading-[1] tracking-tight text-foreground md:text-[56px]">
            Built for the people most often{" "}
            <span className="font-display-italic">targeted</span>.
          </h2>
          <p className="mt-5 max-w-xl font-newsreader text-[18px] leading-[1.55] text-foreground/75">
            Older internet users get phished four times more often than
            average. Gone Phishin&apos; is for them — designed to stay out of
            the way until something is actually wrong.
          </p>
        </header>

        <ol className="grid grid-cols-1 gap-y-14 md:grid-cols-3 md:gap-x-12">
          {items.map((it) => (
            <li key={it.num} className="relative">
              <div className="mb-6 flex items-baseline gap-3 text-primary">
                <span className="font-display text-5xl leading-none">
                  {it.num}
                </span>
                <span className="ml-1 font-mono-display text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {it.label}
                </span>
              </div>
              <h3 className="font-display text-[26px] leading-[1.1] tracking-tight text-foreground">
                {it.title}
              </h3>
              <p className="mt-4 font-newsreader text-[17px] leading-[1.6] text-foreground/75">
                {it.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-24 flex justify-center">
          <FleuronTriangle className="h-3 w-12" />
        </div>
      </div>
    </section>
  );
}
