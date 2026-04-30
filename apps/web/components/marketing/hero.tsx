import Link from "next/link";

/**
 * Hero — left-side copy + right-side product mockup. Pure markup, no
 * external assets. The mockup is a stylized "fake email" card with our
 * warning modal floating over a flagged link, giving the homepage an
 * immediate sense of what the product does.
 */
export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-16 md:grid-cols-[1.1fr_1fr] md:gap-12 md:pt-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Free Chrome extension
          </p>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-[64px]">
            Phishing scams shouldn&apos;t catch you off guard.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Gone Phishin&apos; watches the links in your inbox and warns you
            before you click on something dangerous. For you, or for someone
            you love.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
            >
              Install free
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Works on Gmail and Outlook. We never read your emails.
          </p>
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

/**
 * Stylized mockup of an email with our warning floating over a flagged
 * link. Three layers stacked diagonally for depth: a back card (gradient
 * placeholder for "another email"), the foreground email, and the
 * warning pill.
 */
function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md md:mx-0">
      {/* Back-card decoration */}
      <div
        aria-hidden
        className="absolute -right-6 -top-6 hidden h-[360px] w-[360px] rounded-3xl bg-primary/10 md:block"
      />
      {/* Front email card */}
      <div className="relative rounded-3xl border border-border bg-background shadow-xl">
        <div className="flex items-center gap-1.5 rounded-t-3xl border-b border-border bg-muted/40 px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 text-xs text-muted-foreground">
            Inbox · Gmail
          </span>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Action Required: Verify Your Account
            </p>
            <p className="text-xs text-muted-foreground">
              service@paypa1-secure.com · 2:14 PM
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">
            Dear Customer, we&apos;ve detected unusual activity on your
            account. Please{" "}
            <span className="relative inline-flex items-center">
              <span className="border-b-2 border-rose-500 font-medium text-rose-600">
                verify your account here
              </span>
              <span
                aria-hidden
                className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[11px]"
              >
                🛑
              </span>
            </span>{" "}
            within 24 hours to avoid suspension.
          </p>
          <p className="text-sm text-muted-foreground">
            Thank you,
            <br />
            PayPal Security Team
          </p>
        </div>
      </div>

      {/* Warning pill — floats over the flagged link */}
      <div className="absolute -bottom-6 right-6 max-w-[280px] rounded-2xl border border-border bg-background p-4 shadow-2xl md:-bottom-8 md:right-2">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-lg">
            🛑
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Dangerous link
            </p>
            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
              This looks like a fake PayPal page. Don&apos;t click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
