"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Adds the `.is-visible` class to its child once the element scrolls into view.
 * The actual fade/translate animation lives in globals.css under `.reveal`,
 * so this component only owns the observer wiring. Stagger via the `delay`
 * prop, which corresponds to the `.reveal-delay-{1,2,3}` CSS classes.
 */
export function Reveal({
  children,
  delay,
  className,
  mockup = false,
  reverse = false,
}: {
  children: ReactNode;
  delay?: 1 | 2 | 3;
  className?: string;
  /** Adds the `.reveal-mockup` class for the showcase parallax variant. */
  mockup?: boolean;
  /** Showcase rows that have their mockup column on the left use this. */
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [
    "reveal",
    mockup ? "reveal-mockup" : null,
    reverse ? "reverse" : null,
    delay ? `reveal-delay-${delay}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
