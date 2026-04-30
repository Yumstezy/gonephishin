import Link from "next/link";

/**
 * Stripped-down hero. Centered, single-column, generous breathing room.
 * No illustrations, no animations, no fade-ups. Just clear hierarchy:
 * pill eyebrow, big headline, subhead, two CTAs, supporting line, then
 * a real product mockup that does the visual heavy lifting.
 */
export function Hero() {
  return (
    <section className="relative bg-background pt-20 pb-32 md:pt-28 md:pb-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Free Chrome extension · Gmail &amp; Outlook
        </p>
        <h1 className="mt-7 text-balance text-5xl font-semibold tracking-[-0.04em] text-foreground md:text-7xl lg:text-[80px] lg:leading-[0.95]">
          Phishing scams,
          <br className="hidden md:block" /> stopped at the door.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          Gone Phishin&apos; watches the links in your inbox and warns you the
          moment something looks wrong — for you, or for someone you love.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Install free
          </Link>
          <Link
            href="#features"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Free forever · No account required for the person you protect
        </p>
      </div>

      <HeroMockup />
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="mx-auto mt-20 max-w-3xl px-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-20px_rgb(15_23_42_/_0.18),0_18px_36px_-18px_rgb(15_23_42_/_0.1)]">
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <div className="ml-3 flex-1 text-center text-xs text-muted-foreground">
            mail.google.com
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_minmax(0,260px)] md:p-10">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Action Required: Verify Your Account
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              service@paypa1-secure.com · 2:14 PM
            </p>
            <p className="mt-5 text-[15px] leading-relaxed text-foreground/85">
              Dear Customer, we&apos;ve detected unusual activity on your
              account. Please{" "}
              <span className="border-b-2 border-destructive font-medium text-destructive">
                verify your account here
              </span>{" "}
              within 24 hours to avoid suspension.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              — PayPal Security Team
            </p>
          </div>
          <div className="self-center rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-base">
                🛑
              </span>
              <p className="text-sm font-semibold text-destructive">
                Dangerous link
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              This looks like a fake PayPal page. Click{" "}
              <span className="font-medium text-foreground">Go Back</span> to
              return safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
