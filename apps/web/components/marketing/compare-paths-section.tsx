import Link from "next/link";
import { Reveal } from "./reveal";

/**
 * Two oversized rounded cards stacked vertically (Apple's compare style,
 * not side-by-side). Each card has a corner-bleed accent blob and a
 * single CTA. The first card uses primary blue tone, the second uses
 * warm peach — the only place on the page peach plays a starring role.
 */
export function ComparePathsSection() {
  return (
    <section className="bg-secondary/40 py-32 md:py-44">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mb-20 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Two paths
          </p>
          <h2 className="font-display text-balance text-5xl font-semibold leading-[1] tracking-tight md:text-7xl">
            For yourself,{" "}
            <span className="text-muted-foreground">or someone you love.</span>
          </h2>
        </Reveal>

        <div className="space-y-6">
          <Reveal>
            <PathCard
              tone="primary"
              label="For yourself"
              title="Protect your own inbox."
              blurb="Sign up, install the extension, and you'll see every dangerous link we've stopped on your own dashboard."
              cta="Sign up — it's free"
              href="/sign-up"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PathCard
              tone="warm"
              label="For someone you love"
              title="A parent. A grandparent. A friend."
              blurb="Create your account, generate a six-digit code, and read it to them on the phone. They type it once. You see only the dangerous links they encounter."
              cta="Set up a family circle"
              href="/sign-up"
            />
          </Reveal>
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
    <article className="group relative overflow-hidden rounded-[2rem] bg-background p-10 transition-shadow hover:shadow-lg md:p-14">
      <div
        aria-hidden
        className={`absolute -right-24 -top-24 h-72 w-72 rounded-full ${accentBg} opacity-15 blur-2xl transition-transform duration-700 group-hover:scale-110`}
      />
      <div
        aria-hidden
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${accentBg} opacity-25 blur-2xl`}
      />

      <div className="relative">
        <p
          className={`mb-5 text-sm font-medium uppercase tracking-[0.18em] ${accentText}`}
        >
          {label}
        </p>
        <h3 className="font-display text-balance text-3xl font-semibold leading-tight text-foreground md:text-5xl">
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
