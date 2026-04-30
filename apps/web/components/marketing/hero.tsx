"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Hero — Apple-scale single-column composition. A pill eyebrow, a huge
 * display headline with one accent word in primary blue, a one-line
 * subhead, two CTAs, and a centered product mockup floating on a soft
 * ambient pastel-blue glow.
 *
 * Animation: staggered fade-up reveal on initial load (no scroll trigger
 * needed since it's above the fold). Each block delayed by 80ms for
 * Apple's "settling into place" feel.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Soft ambient gradient that tints the top of the page — peach in
         the top-left corner, pastel blue across, fading out by 60% down. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, rgb(var(--secondary)) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-warm/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-16 md:pb-44 md:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Free Chrome extension · Gmail &amp; Outlook
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mt-7 text-balance text-[64px] font-semibold leading-[0.95] tracking-tight text-foreground md:text-[96px] lg:text-[128px]"
          >
            Phishing scams,
            <br />
            <span className="relative inline-block text-primary">
              stopped
              <svg
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute -bottom-2 left-0 h-3 w-full text-primary/30 md:-bottom-3"
              >
                <path
                  d="M2 6 Q 75 2 150 6 T 298 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            cold.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Gone Phishin&apos; watches the links in your inbox and warns you
            the moment something looks wrong. For you — or for the family
            member you set it up for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <span>Install free</span>
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-2 py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              See how it works
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            We never read your emails · No account required for the person
            you protect
          </motion.p>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-24 max-w-3xl"
    >
      {/* Soft layered ambient glow behind the device */}
      <div
        aria-hidden
        className="absolute -inset-x-12 -top-12 -bottom-20 rounded-[3rem] bg-gradient-to-br from-secondary via-secondary to-warm/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[28px] border border-border/80 bg-card shadow-2xl shadow-primary/10">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-rose-300/70" />
          <span className="h-3 w-3 rounded-full bg-amber-300/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-300/70" />
          <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
            mail.google.com
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_minmax(0,300px)] md:p-10">
          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold text-foreground">
                Action Required: Verify Your Account
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
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

          <motion.div
            initial={{ opacity: 0, x: 20, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative self-center rounded-3xl border border-destructive/15 bg-gradient-to-br from-destructive/5 to-warm/20 p-5 shadow-lg shadow-destructive/5"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/15 text-base">
                🛑
              </span>
              <p className="text-sm font-semibold text-destructive">
                Dangerous link
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              This looks like a fake PayPal page. Click{" "}
              <span className="font-medium text-foreground">Go Back</span> to
              return safely.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
