import { Reveal } from "./reveal";

/**
 * Three numbered moments stacked in a single column. Apple-scale
 * primary-blue numerals (up to 144px on desktop) sit next to the step
 * title and description. No cards, no borders — just type and rhythm.
 */
export function HowItWorksSection() {
  const steps = [
    {
      num: "1",
      title: "Install Gone Phishin'.",
      desc: "One click on the Chrome Web Store. No setup. No account.",
    },
    {
      num: "2",
      title: "Browse normally.",
      desc: "Open Gmail or Outlook the way you always do. Every link gets checked silently in the background.",
    },
    {
      num: "3",
      title: "We catch the bad ones.",
      desc: "If you almost click something dangerous, a warning appears with a big button to go back. That's the entirety of it.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-32 md:py-44">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mb-24 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-primary">
            How it works
          </p>
          <h2 className="font-display text-balance text-5xl font-semibold leading-[1] tracking-tight md:text-7xl">
            Three steps.{" "}
            <span className="text-muted-foreground">No setup.</span>
          </h2>
        </Reveal>

        <div className="space-y-20 md:space-y-24">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.05}>
              <div className="grid grid-cols-1 items-baseline gap-6 md:grid-cols-[140px_1fr] md:gap-12">
                <span className="font-display text-7xl font-semibold leading-none text-primary md:text-[144px]">
                  {s.num}
                </span>
                <div>
                  <h3 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-5xl">
                    {s.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
