/**
 * Bold privacy promise on a primary-blue band. The single most important
 * trust signal on the marketing page — it's why families will install
 * this on a parent's browser, and why the parent will accept it.
 */
export function PrivacySection() {
  return (
    <section className="bg-primary py-24 text-primary-foreground md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          We never read your emails. Period.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
          Gone Phishin&apos; only checks the links in your messages. Not the
          subject. Not the sender. Not the body. Not the attachments. Just the
          URLs — to verify they&apos;re safe before you click on them.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-3 text-left text-sm text-primary-foreground/85 sm:grid-cols-2">
          <PromiseRow text="No email content ever leaves your browser" />
          <PromiseRow text="No tracking, no advertising, no resale" />
          <PromiseRow text="Permissions limited to Gmail and Outlook" />
          <PromiseRow text="Open about how everything works, anytime" />
        </div>
      </div>
    </section>
  );
}

function PromiseRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 shrink-0"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {text}
    </div>
  );
}
