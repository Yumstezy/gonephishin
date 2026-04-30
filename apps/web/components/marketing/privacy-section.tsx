/**
 * The trust signal. Plain dark band with a single bold statement and
 * four supporting bullets. No ornaments, no glow blobs.
 */
export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="border-t border-foreground/10 bg-foreground py-32 text-background md:py-40"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-background/50">
          A promise
        </p>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
          We never read your emails.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/70 md:text-lg">
          Gone Phishin&apos; only checks the URLs in your messages. Not the
          subject. Not the sender. Not the body. Not the attachments. Just
          the links — to verify they&apos;re safe before you click.
        </p>
        <ul className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-2 text-left text-sm sm:grid-cols-2">
          <PromiseRow text="No content ever leaves your browser" />
          <PromiseRow text="No tracking, no advertising" />
          <PromiseRow text="Permissions limited to Gmail and Outlook" />
          <PromiseRow text="Open about how it all works" />
        </ul>
      </div>
    </section>
  );
}

function PromiseRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-background/10 bg-background/5 px-4 py-3 text-background/85">
      <svg
        viewBox="0 0 20 20"
        className="mt-1 h-3.5 w-3.5 shrink-0"
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
    </li>
  );
}
