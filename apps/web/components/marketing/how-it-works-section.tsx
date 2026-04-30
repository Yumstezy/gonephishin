import { WaveRule } from "./ornament";

/**
 * Three numbered steps as a single editorial spread. Roman numerals,
 * heavy display headlines, italic emphasis. Reads like book chapters.
 */
export function HowItWorksSection() {
  const steps = [
    {
      num: "Chapter I",
      title: "Install Gone Phishin'.",
      desc: "One click on the Chrome Web Store. No setup. No account required.",
    },
    {
      num: "Chapter II",
      title: "Browse normally.",
      desc: "Open Gmail or Outlook the way you always do. Every link gets checked silently in the background.",
    },
    {
      num: "Chapter III",
      title: "We catch the bad ones.",
      desc: "If you almost click on something dangerous, a clear warning appears with a big button to go back. That's the entirety of it.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-20 text-center">
          <p className="mb-4 font-mono-display text-[11px] uppercase tracking-[0.3em] text-primary">
            How It Works
          </p>
          <h2 className="font-display text-[44px] leading-[1] tracking-tight text-foreground md:text-[60px]">
            Three steps, no{" "}
            <span className="font-display-italic">technical setup</span>.
          </h2>
        </header>

        <div className="space-y-20">
          {steps.map((s, i) => (
            <article
              key={s.num}
              className="grid grid-cols-1 items-baseline gap-6 md:grid-cols-[200px_1fr] md:gap-12"
            >
              <div className="border-l-2 border-primary pl-4 md:border-l-0 md:pl-0 md:text-right">
                <p className="font-mono-display text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {s.num}
                </p>
              </div>
              <div>
                <h3 className="font-display text-[36px] leading-[1.05] tracking-tight text-foreground md:text-[44px]">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-prose font-newsreader text-[18px] leading-[1.6] text-foreground/75">
                  {s.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="md:col-span-2 mt-12 flex justify-center">
                  <WaveRule className="h-3 w-32 text-foreground/25" />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
