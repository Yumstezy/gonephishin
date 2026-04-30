import Link from "next/link";

/**
 * Two side-by-side cards pitching the two audiences (self-managed vs
 * caregiver-paired). Restyled to match the rest of the marketing page —
 * no shadcn Card primitive, just plain rounded panels with primary-tinted
 * left border per option.
 */
export function ComparePathsSection() {
  return (
    <section className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Two ways to use Gone Phishin&apos;.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Whichever side you&apos;re on, the protection is the same.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PathCard
            label="For yourself"
            title="Protect your own inbox."
            blurb="Sign up, install the extension, and you'll see your own dashboard with every dangerous link we've stopped."
            cta="Sign up — it's free"
            href="/sign-up"
            primary
          />
          <PathCard
            label="For a family member"
            title="Watch out for someone you love."
            blurb="Create your account, generate a 6-digit code, read it to them over the phone. They type it once. You see what dangerous links they encounter — without ever reading their email."
            cta="Set up a family circle"
            href="/sign-up"
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
  href,
  primary = false,
}: {
  label: string;
  title: string;
  blurb: string;
  cta: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-background p-8">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">
        {blurb}
      </p>
      <Link
        href={href}
        className={
          primary
            ? "mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            : "mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        }
      >
        {cta}
      </Link>
    </div>
  );
}
