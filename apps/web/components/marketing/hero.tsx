import Link from "next/link";

/**
 * Apple-scale hero. Centered, full-width, single-column. Massive display
 * type, generous breathing room, and a floating product mockup below.
 * Soft pastel-blue ambient blob behind the mockup adds warmth without
 * fighting the headline.
 */
export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-12 pb-32 md:pt-24 md:pb-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Free Chrome extension · Works in Gmail &amp; Outlook
        </p>
        <h1 className="font-display text-balance text-[56px] font-semibold leading-[0.95] tracking-tight text-foreground md:text-[88px] lg:text-[112px]">
          Phishing scams,
          <br />
          <span className="text-primary">stopped at the door.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Gone Phishin&apos; watches the links in your inbox and warns you the
          moment something looks wrong — for you, or for the family member
          you set it up for.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:scale-[1.02]"
          >
            Install free
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-2 py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
          >
            See how it works
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <HeroMockup />
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-24 max-w-3xl px-6">
      {/* Soft ambient blob — pastel-blue glow behind the device */}
      <div
        aria-hidden
        className="absolute inset-x-12 -top-12 -bottom-12 rounded-[3rem] bg-gradient-to-br from-secondary via-secondary to-warm/40 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-rose-300/70" />
          <span className="h-3 w-3 rounded-full bg-amber-300/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-300/70" />
          <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
            mail.google.com
          </div>
        </div>

        {/* Email content */}
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-[1fr_auto] md:p-10">
          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold text-foreground">
                Action Required: Verify Your Account
              </p>
              <p className="text-sm text-muted-foreground">
                service@paypa1-secure.com · 2:14 PM
              </p>
            </div>
            <p className="text-base leading-relaxed text-foreground/85">
              Dear Customer, we&apos;ve detected unusual activity on your
              account. Please{" "}
              <span className="border-b-2 border-destructive/80 font-medium text-destructive">
                verify your account here
              </span>{" "}
              within 24 hours to avoid suspension.
            </p>
            <p className="text-sm text-muted-foreground">
              — PayPal Security Team
            </p>
          </div>

          {/* Warning card — sized to feel like our actual extension UI */}
          <div className="self-center rounded-2xl border border-destructive/20 bg-destructive/5 p-5 md:max-w-xs">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/15 text-base">
                🛑
              </span>
              <p className="text-sm font-semibold text-destructive">
                Dangerous link
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              This looks like a fake PayPal page. We blocked it. Click{" "}
              <span className="font-medium text-foreground">Go Back</span> to
              return safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
