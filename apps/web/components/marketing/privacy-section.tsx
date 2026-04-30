/**
 * Full-bleed privacy promise — a single oversized statement on a deep
 * brand-blue band. The trust signal that earns the install.
 */
export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-44"
    >
      {/* Soft glow blob — friendly, not corporate */}
      <div
        aria-hidden
        className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-warm/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="mb-8 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground/70">
          A promise
        </p>
        <h2 className="font-display text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[96px]">
          We never read
          <br />
          your <span className="text-warm">emails.</span>
        </h2>
        <p className="mx-auto mt-10 max-w-2xl text-balance text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
          Gone Phishin&apos; only checks the URLs in your messages. Not the
          subject. Not the sender. Not the body. Not the attachments. Just
          the links — to verify they&apos;re safe before you click.
        </p>

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
          <PromiseRow text="No email content ever leaves your browser" />
          <PromiseRow text="No tracking, no advertising, no resale" />
          <PromiseRow text="Permissions limited to Gmail and Outlook" />
          <PromiseRow text="Open about how it all works, anytime" />
        </div>
      </div>
    </section>
  );
}

function PromiseRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-primary-foreground/10 px-5 py-4 text-base text-primary-foreground/90">
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
      {text}
    </div>
  );
}
