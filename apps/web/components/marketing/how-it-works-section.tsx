/**
 * Three numbered steps in plain English. Numbered circles + headline +
 * description per step. Vertical stack on mobile, horizontal on desktop.
 */
export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Install Gone Phishin'",
      desc: "One click on the Chrome Web Store. No setup, no account required.",
    },
    {
      num: "02",
      title: "Browse normally",
      desc: "Open Gmail or Outlook the way you always do. Every link in every email gets checked silently.",
    },
    {
      num: "03",
      title: "We catch the bad ones",
      desc: "If you almost click on something dangerous, a clear warning appears with a big button to go back. That's it.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Three steps. No technical setup.
          </h2>
        </div>
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-primary">
                  {s.num}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="absolute -right-4 top-2 hidden h-px w-8 bg-border md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
