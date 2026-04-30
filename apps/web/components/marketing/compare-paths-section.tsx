import Link from "next/link";

/**
 * Two side-by-side editorial cards — each framed like a chapter heading
 * with a roman label, italic subtitle, and a single CTA at the bottom.
 */
export function ComparePathsSection() {
  return (
    <section className="border-y border-border bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-16 text-center">
          <p className="mb-4 font-mono-display text-[11px] uppercase tracking-[0.3em] text-primary">
            Two Ways
          </p>
          <h2 className="font-display text-[44px] leading-[1] tracking-tight text-foreground md:text-[56px]">
            For yourself, or for{" "}
            <span className="font-display-italic">someone you love</span>.
          </h2>
          <p className="mt-5 font-newsreader text-[18px] text-foreground/70">
            Whichever side you&apos;re on, the protection is the same.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
          <PathCard
            label="Option I"
            title="For yourself."
            italic="A solo affair."
            blurb="Sign up, install the extension, and you'll see your own dashboard with every dangerous link we've stopped. No one else need be involved."
            cta="Sign up — it's free"
            href="/sign-up"
            primary
          />
          <PathCard
            label="Option II"
            title="For a family member."
            italic="Pair by phone call."
            blurb="Create your account, generate a six-digit code, and read it to them over the phone. They type it once. You see what dangerous links they encounter — without ever reading their email."
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
  italic,
  blurb,
  cta,
  href,
  primary = false,
}: {
  label: string;
  title: string;
  italic: string;
  blurb: string;
  cta: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <article className="flex flex-col bg-background p-10 md:p-12">
      <p className="mb-6 font-mono-display text-[10px] uppercase tracking-[0.3em] text-primary">
        {label}
      </p>
      <h3 className="font-display text-[32px] leading-[1.05] tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1 font-display-italic text-[18px] text-foreground/55">
        {italic}
      </p>
      <p className="mt-6 flex-1 font-newsreader text-[17px] leading-[1.6] text-foreground/75">
        {blurb}
      </p>
      <div className="mt-10">
        <Link
          href={href}
          className={
            primary
              ? "inline-flex items-center gap-2 border-y-2 border-primary bg-primary px-6 py-2.5 font-display text-base text-primary-foreground transition-colors hover:bg-foreground hover:border-foreground"
              : "inline-flex items-center gap-2 border-b-2 border-foreground/40 px-1 pb-1 font-display-italic text-base text-foreground transition-colors hover:border-foreground"
          }
        >
          {cta} <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
