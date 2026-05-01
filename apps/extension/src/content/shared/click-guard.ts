import type { ScanResult } from "@gonephishin/shared";
import { showWarningModal, type ModalOutcome } from "./warning-modal.js";

const verdictByUrl = new Map<string, ScanResult>();
const urlBypassed = new Set<string>();

/** Update the guard's index of verdicts. Called by the scanner. */
export function rememberVerdict(result: ScanResult): void {
  verdictByUrl.set(result.url, result);
}

/**
 * Install a single capture-phase pointerdown listener. We attach to
 * pointerdown (not click) so we run before the page's own handlers, and we
 * use the capture phase so we can stop propagation cleanly. Covers
 * middle-click, ⌘/Ctrl+click, and right-click "open in new tab".
 */
export function installClickGuard(
  onOutcome: (url: string, outcome: ModalOutcome) => void,
): void {
  document.addEventListener(
    "pointerdown",
    async (event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.<HTMLAnchorElement>("a[data-gp-url]");
      if (!anchor) return;
      const url = anchor.dataset.gpUrl!;
      if (urlBypassed.has(url)) return;
      const verdict = verdictByUrl.get(url);
      if (!verdict) return;
      if (verdict.verdict !== "sketchy" && verdict.verdict !== "dangerous")
        return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const outcome = await showWarningModal(verdict);
      onOutcome(url, outcome);
      if (outcome === "ignored_warning") {
        urlBypassed.add(url);
        anchor.click();
      }
    },
    { capture: true },
  );
}
