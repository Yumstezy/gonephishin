import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
          Stop a scam in 10 seconds.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          Install Gone Phishin&apos; on your browser, or set it up for someone
          who needs it more than you do.
        </p>
        <Link
          href="/sign-up"
          className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Install free
        </Link>
      </div>
    </section>
  );
}
