import Link from "next/link";
import { CompassStar, WaveRule } from "./ornament";

/**
 * Editorial hero. Asymmetric grid: large display headline on the left,
 * stylized email-warning vignette on the right. Vintage newspaper-by-the-sea
 * aesthetic — ornaments, small caps, italics, and a single coral accent.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Top metadata strip — like a paper masthead's date line */}
      <div className="mx-auto max-w-6xl border-b border-border/70 px-6 py-3">
        <div className="flex items-center justify-between font-mono-display text-[11px] uppercase tracking-widest text-foreground/60">
          <span>Vol. I · No. 1</span>
          <span className="hidden sm:inline">A Manual on Modern Phishing</span>
          <span>Cape Cod · 2026</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 pb-24 pt-16 md:grid-cols-[1.25fr_1fr] md:gap-20 md:pb-32 md:pt-24">
        <div>
          {/* Section eyebrow */}
          <div className="mb-10 flex items-center gap-4 text-primary">
            <CompassStar className="h-7 w-7" />
            <span className="font-mono-display text-xs uppercase tracking-[0.3em]">
              The Bulletin
            </span>
          </div>

          <h1 className="font-display text-[68px] leading-[0.95] tracking-tight text-foreground md:text-[88px] lg:text-[104px]">
            Don&apos;t get
            <br />
            <span className="font-display-italic text-primary">
              caught
            </span>{" "}
            by
            <br />
            phishing scams.
          </h1>

          <div className="mt-8 max-w-md font-newsreader has-dropcap">
            <p className="text-[19px] leading-[1.55] text-foreground/85">
              Gone Phishin&apos; is a free Chrome extension that watches the
              links in your inbox and warns you — in plain English —{" "}
              <em>before</em> you click on something dangerous. For you, or
              for someone you love.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-3 rounded-none border-y-2 border-primary bg-primary px-7 py-3 font-display text-base text-primary-foreground transition-colors hover:bg-foreground hover:border-foreground"
            >
              Install Free
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="#how-it-works"
              className="font-display text-base italic text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-colors hover:decoration-foreground"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-10 max-w-md font-mono-display text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            Works in Gmail &amp; Outlook · We never read your emails
          </p>
        </div>

        <HeroVignette />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <WaveRule className="h-3 w-full text-primary/40" />
      </div>
    </section>
  );
}

function HeroVignette() {
  return (
    <figure className="relative">
      {/* Decorative back panel — angled cream card behind the foreground */}
      <div
        aria-hidden
        className="absolute -right-3 -top-3 hidden h-full w-full rotate-2 rounded-md border border-border bg-secondary/50 md:block"
      />

      {/* Foreground "newspaper photo" frame */}
      <div className="relative -rotate-1 rounded-md border border-border bg-card p-6 shadow-[8px_10px_0_rgba(14,26,38,0.06)] md:rotate-0">
        {/* Caption strip on top */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3 font-mono-display text-[10px] uppercase tracking-[0.25em] text-foreground/60">
          <span>Exhibit A</span>
          <span>Inbox · 2:14 PM</span>
        </div>

        {/* Sender + subject */}
        <p className="font-display text-lg leading-snug text-foreground">
          Action Required: Verify Your Account
        </p>
        <p className="mt-1 font-mono-display text-[11px] uppercase tracking-wider text-foreground/55">
          service@paypa1-secure.com
        </p>

        {/* Body excerpt */}
        <p className="mt-5 font-newsreader text-[15px] leading-[1.6] text-foreground/80">
          Dear Customer, we have detected unusual activity on your account.
          Please{" "}
          <span className="relative inline-flex items-baseline">
            <span className="border-b-2 border-destructive font-medium text-destructive">
              verify your account here
            </span>
          </span>{" "}
          within twenty-four hours to avoid suspension.
        </p>

        {/* Faux signature */}
        <p className="mt-4 font-display-italic text-sm text-foreground/55">
          — PayPal Security Team
        </p>

        {/* The warning slip — pinned at the bottom-right, like a stamped
           verdict on a case file. */}
        <div className="absolute -bottom-7 -right-4 max-w-[260px] rotate-2 border-y-2 border-foreground bg-background p-4 shadow-[5px_6px_0_rgba(14,26,38,0.12)]">
          <div className="flex items-center justify-between font-mono-display text-[9px] uppercase tracking-[0.3em] text-destructive">
            <span>Verdict</span>
            <span>·</span>
            <span>No. 0042</span>
          </div>
          <p className="mt-2 font-display text-2xl leading-none text-destructive">
            Dangerous
          </p>
          <p className="mt-3 font-newsreader text-[13px] leading-[1.45] text-foreground/80">
            This is a fake PayPal page.{" "}
            <span className="font-display-italic">Don&apos;t click.</span>
          </p>
        </div>
      </div>

      <figcaption className="mt-10 max-w-xs font-display-italic text-sm text-foreground/55 md:mt-14">
        A scam in the wild, caught on the line and labeled.
      </figcaption>
    </figure>
  );
}
