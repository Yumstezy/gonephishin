import { useEffect, useRef } from "react";

const cache = new Map<string, Promise<string>>();
async function load(path: string): Promise<string> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(path).then((r) => r.text());
    cache.set(path, p);
  }
  return p;
}

/**
 * Inlines an SVG from the extension's `public/` so currentColor fills work.
 * Same pattern as the marketing site, simplified for the popup. The popup
 * runs as a normal Chrome extension page, so a relative URL like
 * "/fish.svg" resolves to the bundled asset.
 */
export function InlineSvg({
  src,
  className,
  label,
}: {
  src: string;
  className?: string;
  label?: string;
}) {
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
