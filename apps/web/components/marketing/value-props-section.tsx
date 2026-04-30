/**
 * Three value-prop columns. Tiny accent dot + headline + paragraph. No
 * illustrations, no cards, no shadows. Just text — generous spacing and
 * thin dividers do the design work.
 */
export function ValuePropsSection() {
  const items = [
    {
      title: "Every link, checked the moment it lands.",
      desc: "Inspected against the same threat database Chrome itself uses, plus our own checks for fake brand pages and look-alike domains.",
    },
    {
      title: "A clear warning, in plain English.",
      desc: "When a link looks dangerous, the click is intercepted. A warning appears with one big button to go back — no jargon, no decisions.",
    },
    {
      title: "Set it up for someone you love.",
      desc: "Pair Gone Phishin' with a parent or grandparent in under a minute. They never need an account. You only see what's dangerous.",
    },
  ];

  return (
    <section
      id="features"
      className="border-t border-border bg-background py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            What it does
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
            Quietly, in the background — until something is wrong.
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-y-14 md:grid-cols-3 md:gap-x-12 md:gap-y-0">
          {items.map((it, i) => (
            <li
              key={it.title}
              className="md:border-l md:border-border md:pl-8 md:first:border-l-0 md:first:pl-0"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug">
                {it.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
