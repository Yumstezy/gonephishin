"use client";

import { useEffect } from "react";

/**
 * Adds the `.scrolled` class to the nav element once the user has scrolled
 * past 8px. The CSS rule `nav.site.scrolled { border-bottom-color: ... }`
 * fades a divider in. Mounts once at page load; cleans up on unmount.
 *
 * Mounted in nav.tsx as a no-render sibling of the actual nav element.
 */
export function StickyNavScript() {
  useEffect(() => {
    const nav = document.getElementById("siteNav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
