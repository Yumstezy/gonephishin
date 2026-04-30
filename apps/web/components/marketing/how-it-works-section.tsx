/**
 * Three numbered moments stacked vertically. Single-column. Each row has
 * a large numeral + headline + description. Apple-style scale, no cards.
 */
export function HowItWorksSection() {
  const steps = [
    {
      num: "1",
      title: "Install Gone Phishin'",
      desc: "One click on the Chrome Web Store. No setup, no account.",
    },
    {
      num: "2",
      title: "Browse normally",
      desc: "Open Gmail or Outlook the way you always do. Every link gets checked silently in the background.",
    },
    {
      num: "3",
      title: "We catch the bad ones",
      desc: "If you almost click on something dangerous, a warning appears with a big button to go back. That's it.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-32 md:py-40">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-20 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-primary">
            How it works
          </p>
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Three steps. <span className="text-muted-foreground">No setup.</span>
          </h2>
        </div>

        <div className="space-y-16 md:space-y-20">
          {steps.map((s) => (
            <div
              key={s.num}
              className="grid grid-cols-1 items-baseline gap-6 md:grid-cols-[120px_1fr] md:gap-12"
            >
              <span className="font-display text-7xl font-semibold leading-none text-primary md:text-[112px]">
                {s.num}
              </span>
              <div>
                <h3 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
