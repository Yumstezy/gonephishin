/**
 * Three steps, single column, very calm. Each row: monospace step number
 * on the left, big text on the right. No fancy stuff.
 */
export function HowItWorksSection() {
  const steps = [
    {
      title: "Install Gone Phishin'.",
      desc: "One click on the Chrome Web Store. No setup. No account.",
    },
    {
      title: "Browse normally.",
      desc: "Open Gmail or Outlook the way you always do. We check every link silently in the background.",
    },
    {
      title: "We catch the bad ones.",
      desc: "If you almost click on something dangerous, a warning appears with one big button to go back.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-t border-border bg-secondary/40 py-32 md:py-40"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            How it works
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
            Three steps. No technical setup.
          </h2>
        </div>

        <ol className="space-y-14 md:space-y-16">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-10"
            >
              <span className="font-mono text-sm text-muted-foreground md:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
