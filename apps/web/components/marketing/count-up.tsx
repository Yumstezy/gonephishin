"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number from 0 to `value` over `duration` ms once it enters
 * the viewport. Single rAF loop, cubic ease-out, respects
 * prefers-reduced-motion (jumps straight to the final value).
 *
 * The `format` prop accepts a function so callers can render "23,481"
 * with thousands separators or "$0" with a currency prefix.
 */
export function CountUp({
  value,
  duration = 1600,
  format = (n) => Math.round(n).toLocaleString(),
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value === 0 ? "0" : "0");
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(format(value));
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const t0 = performance.now();
      const tick = (now: number) => {
        const elapsed = now - t0;
        const t = Math.min(1, elapsed / duration);
        // Cubic ease-out — fast at the start, settles at the end.
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(format(value * eased));
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(format(value));
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, format]);

  return <span ref={ref}>{display}</span>;
}
