import Link from "next/link";

/**
 * Two paths, side-by-side on desktop, stacked on mobile. Plain cards,
 * thin border, generous padding. The CTA button is the only color
 * present per card.
 */
export function ComparePathsSection() {
  return (
    <section className="border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Two paths
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
            For yourself, or for someone you love.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Whichever side you&apos;re on, the protection is the same.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <PathCard
            label="For yourself"
            title="Protect your own inbox."
            blurb="Sign up, install the extension, and you'll see every dangerous link we've stopped on your own dashboard."
            cta="Sign up — it's free"
            primary
          />
          <PathCard
            label="For a family member"
            title="A parent. A grandparent. A friend."
            blurb="Create your account, generate a 6-digit code, and read it to them on the phone. They type it once. You see only what's dangerous."
            cta="Set up a family circle"
          />
        </div>
      </div>
    </section>
  );
}

function PathCard({
  label,
  title,
  blurb,
  cta,
  primary = false,
}: {
  label: string;
  title: string;
  blurb: string;
  cta: string;
  primary?: boolean;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-8 md:p-10">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
        {title}
      </h3>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
        {blurb}
      </p>
      <Link
        href="/sign-up"
        className={
          primary
            ? "mt-8 inline-flex h-10 w-fit items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            : "mt-8 inline-flex h-10 w-fit items-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        }
      >
        {cta}
      </Link>
    </article>
  );
}
