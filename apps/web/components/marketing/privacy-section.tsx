import { Reveal } from "./reveal";

/**
 * Privacy section — full-bleed primary-blue band. The single
 * highest-trust moment on the page. Massive headline with the emphasized
 * word ("emails.") in warm peach so the page's two accent colors meet.
 * Soft glow blobs floating off the edges for warmth.
 */
export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-48"
    >
      <div
        aria-hidden
        className="absolute -left-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-warm/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="mb-8 text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
            A promise
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-8xl lg:text-[112px]">
            We never read
            <br />
            your <span className="text-warm">emails.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-balance text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
            Gone Phishin&apos; only checks the URLs in your messages. Not the
            subject. Not the sender. Not the body. Not the attachments. Just
            the links — to verify they&apos;re safe before you click.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <PromiseRow text="No email content ever leaves your browser" />
            <PromiseRow text="No tracking, no ads, no data resale" />
            <PromiseRow text="Permissions limited to Gmail &amp; Outlook" />
            <PromiseRow text="Open about how it all works, anytime" />
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function PromiseRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-primary-foreground/10 px-5 py-4 text-base text-primary-foreground/90 backdrop-blur-sm">
      <svg
        viewBox="0 0 20 20"
        className="mt-1 h-4 w-4 shrink-0 text-warm"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 5 8 14l-4-4" />
      </svg>
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </li>
  );
}
