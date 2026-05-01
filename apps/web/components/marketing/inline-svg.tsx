"use client";

import { useEffect, useRef } from "react";

/**
 * Loads an SVG from a public URL and inlines it into the DOM so `currentColor`
 * fills work and Tailwind classes can resize it. Module-level cache so a 2nd
 * mount of the same path reuses the prior fetch.
 *
 * Why we don't use <img>: image elements don't honor currentColor, so the
 * brand SVGs (fish, fish-line, wordmark) couldn't pick up `color: var(--primary)`
 * from their container.
 */
const cache = new Map<string, Promise<string>>();
async function load(path: string): Promise<string> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(path).then((r) => r.text());
    cache.set(path, p);
  }
  return p;
}

interface InlineSvgProps {
  src: string;
  className?: string;
  /** When set, the wrapper gets role="img" + aria-label; otherwise aria-hidden. */
  label?: string;
}

export function InlineSvg({ src, className, label }: InlineSvgProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    void load(src).then((text) => {
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = text;
      const svg = ref.current.querySelector("svg");
      if (svg) {
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <span
      ref={ref}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
