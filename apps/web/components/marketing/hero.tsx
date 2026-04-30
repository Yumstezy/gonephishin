import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/**
 * Plain default hero — placeholder until the user supplies the final
 * design. Centered headline + subhead + two CTAs on a light background.
 */
export function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-background">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-32 text-center">
        <Logo size={64} asLink={false} className="mb-8" />
        <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Don&apos;t get caught
          <br />
          by phishing scams.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Gone Phishin&apos; watches your inbox so you — and the people you
          love — never click on something dangerous by mistake.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Install free
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
