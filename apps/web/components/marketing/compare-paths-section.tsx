import Link from "next/link";

/**
 * Two paths, stacked vertically as oversized rounded cards. Apple's
 * single-column compare style — full-width on desktop, lots of breathing
 * room. Each card has a friendly emoji-style indicator and one big CTA.
 */
export function ComparePathsSection() {
  return (
    <section className="bg-secondary/40 py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center">
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Two ways to <span className="text-primary">stay safe.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
            Whichever side you&apos;re on, the protection is the same.
          </p>
        </div>

        <div className="space-y-6">
          <PathCard
            tone="primary"
            label="For yourself"
            title="Protect your own inbox."
            blurb="Sign up, install the extension, and you'll see every dangerous link we've stopped on your own dashboard."
            cta="Sign up — it's free"
            href="/sign-up"
          />
          <PathCard
            tone="warm"
            label="For someone you love"
            title="A parent. A grandparent. A friend."
            blurb="Create your account, generate a six-digit code, and read it to them on the phone. You'll see the dangerous links they encounter — never anything they actually read."
            cta="Set up a family circle"
            href="/sign-up"
          />
        </div>
      </div>
    </section>
  );
}

function PathCard({
  tone,
  label,
  title,
  blurb,
  cta,
  href,
}: {
  tone: "primary" | "warm";
  label: string;
  title: string;
  blurb: string;
  cta: string;
  href: string;
}) {
  const accentBg = tone === "primary" ? "bg-primary" : "bg-warm";
  const accentText = tone === "primary" ? "text-primary" : "text-warm-foreground";

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-background p-10 shadow-sm transition-shadow hover:shadow-md md:p-14">
      <div
        aria-hidden
        className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${accentBg} opacity-10 transition-transform group-hover:scale-110`}
      />
      <div className="relative">
        <p className={`mb-5 text-sm font-medium uppercase tracking-[0.14em] ${accentText}`}>
          {label}
        </p>
        <h3 className="font-display text-balance text-3xl font-semibold leading-tight md:text-5xl">
          {title}
        </h3>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {blurb}
        </p>
        <Link
          href={href}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-base font-medium text-background transition-transform hover:scale-[1.02]"
        >
          {cta} <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
