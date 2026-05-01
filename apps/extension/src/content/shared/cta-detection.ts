/**
 * Identify links the user is realistically about to click on. The signal
 * is "looks like a primary call-to-action button" — used by the painter to
 * decide whether to apply the always-visible inline mark.
 *
 * Heuristics, in order:
 *  1. Rendered height >= 32px — emails almost always use vertical padding
 *     to make CTA buttons stand out, so any link drawing taller than ~2
 *     lines of text is button-styled.
 *  2. Action-verb text — "Pay", "View invoice", "Confirm", "Open" etc.
 *     This catches plain-text CTAs that aren't styled as buttons.
 *  3. Button-like ancestor styling — non-transparent background colour
 *     plus vertical padding within 3 ancestor levels. Catches the common
 *     email pattern of a link wrapped in a <td> with bgcolor.
 *
 * Always returns false for hidden / zero-size elements.
 */
export function isLikelyCta(a: HTMLAnchorElement): boolean {
  const rect = a.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  if (rect.height >= 32) return true;
  if (hasCtaText(a)) return true;
  if (hasButtonStyling(a)) return true;
  return false;
}

const CTA_WORDS =
  /\b(pay|view|confirm|open|continue|get|claim|sign\s*in|log\s*in|update|verify|download|start|reset|review|see|read|join|book|order|track|complete|finish|activate|access|submit|reply|respond|proceed|click\s*here|tap\s*here|here)\b/i;

function hasCtaText(a: HTMLAnchorElement): boolean {
  const text = (a.textContent ?? "").trim();
  if (text.length === 0 || text.length > 60) return false;
  return CTA_WORDS.test(text);
}

function hasButtonStyling(a: HTMLAnchorElement): boolean {
  let el: HTMLElement | null = a;
  for (let i = 0; i < 4 && el; i++) {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const padding =
        parseFloat(cs.paddingTop || "0") + parseFloat(cs.paddingBottom || "0");
      if (padding >= 6) return true;
    }
    el = el.parentElement;
  }
  return false;
}
