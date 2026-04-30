import { CompassStar } from "./ornament";

/**
 * Privacy promise rendered as a full-bleed pull-quote. Deep navy band
 * with a centered ornament, oversized italic quote, and four supporting
 * promises in small caps.
 */
export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="relative bg-primary py-28 text-primary-foreground md:py-36"
    >
      {/* Subtle paper texture re-applied with multiplied alpha so it reads
         on the dark band without overwhelming the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <CompassStar className="mx-auto mb-10 h-10 w-10 text-primary-foreground/70" />
        <p className="mb-6 font-mono-display text-[11px] uppercase tracking-[0.3em] text-primary-foreground/70">
          A Solemn Promise
        </p>
        <blockquote>
          <p className="font-display text-[44px] leading-[1.05] tracking-tight md:text-[64px]">
            <span aria-hidden className="opacity-40">
              &ldquo;
            </span>
            We never read your{" "}
            <span className="font-display-italic">emails</span>. Period.
            <span aria-hidden className="opacity-40">
              &rdquo;
            </span>
          </p>
        </blockquote>
        <p className="mx-auto mt-8 max-w-xl font-newsreader text-[17px] leading-[1.6] text-primary-foreground/85">
          Gone Phishin&apos; only checks the URLs in your messages. Not the
          subject. Not the sender. Not the body. Not the attachments. Just the
          links — to verify they&apos;re safe before you click on them.
        </p>

        <ul className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-2">
          <PromiseRow text="No email content ever leaves your browser" />
          <PromiseRow text="No tracking, no advertising, no resale" />
          <PromiseRow text="Permissions limited to Gmail and Outlook" />
          <PromiseRow text="Open about how everything works, anytime" />
        </ul>
      </div>
    </section>
  );
}

function PromiseRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 border-y border-primary-foreground/15 py-3 font-newsreader text-[15px] text-primary-foreground/85">
      <svg
        viewBox="0 0 12 12"
        className="mt-1.5 h-2.5 w-2.5 shrink-0 text-primary-foreground/70"
        aria-hidden
      >
        <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill="currentColor" />
      </svg>
      {text}
    </li>
  );
}
