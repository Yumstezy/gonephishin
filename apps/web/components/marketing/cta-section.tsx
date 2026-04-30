import Link from "next/link";
import { Reveal } from "./reveal";

/**
 * Final call to action before the footer. Centered, big, single-button.
 * Sits on a clean white background to give the eye a rest after the
 * dense FAQ and before the footer.
 */
export function CTASection() {
  return (
    <section className="bg-background py-32 md:py-44">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="font-display text-balance text-5xl font-semibold leading-[1] tracking-tight md:text-7xl">
            Stop a scam in <span className="text-primary">10 seconds.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Install Gone Phishin&apos; on your browser, or set it up for someone
            who needs it more than you do.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <span>Install free</span>
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
