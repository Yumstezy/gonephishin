import type { ScanResult, Verdict } from "@gonephishin/shared";

/**
 * Hover-revealed pill that shows the safety verdict for any scanned link.
 * One shared shadow-DOM host element per page; we move it to the hovered
 * anchor instead of creating a new element each time. Sized large enough
 * to read without effort.
 */
let host: HTMLElement | null = null;
let visibleFor: HTMLAnchorElement | null = null;

export function installHoverTooltips(): void {
  document.addEventListener("pointerover", (event) => {
    const anchor = anchorFromEvent(event.target);
    if (!anchor) return;
    if (visibleFor === anchor) return;
    showTooltip(anchor);
  });
  document.addEventListener("pointerout", (event) => {
    const from = anchorFromEvent(event.target);
    const to = anchorFromEvent(event.relatedTarget);
    if (from && from !== to) hideTooltip();
  });
  // Hide on scroll/resize so the pill doesn't drift away from its anchor.
  window.addEventListener("scroll", hideTooltip, { passive: true });
  window.addEventListener("resize", hideTooltip);
}

function anchorFromEvent(t: EventTarget | null): HTMLAnchorElement | null {
  return (t as Element | null)?.closest?.<HTMLAnchorElement>("a[data-gp-state]") ?? null;
}

function showTooltip(anchor: HTMLAnchorElement) {
  visibleFor = anchor;
  const root = ensureHost();
  const verdict = (anchor.dataset.gpState as Verdict) ?? "safe";
  const threatType = anchor.dataset.gpThreat ?? null;
  const url = anchor.dataset.gpUrl ?? anchor.href;

  root.innerHTML = "";
  const fragment = buildPill({
    verdict,
    threatType: threatType as ScanResult["threatType"],
    url,
  });
  root.appendChild(fragment);
  const pill = root.querySelector<HTMLElement>(".pill");
  if (pill) positionPill(pill, anchor);
}

function hideTooltip() {
  visibleFor = null;
  if (host) host.shadowRoot!.innerHTML = "";
}

function ensureHost(): ShadowRoot {
  if (host) return host.shadowRoot!;
  host = document.createElement("div");
  host.id = "gonephishin-tooltip-host";
  host.style.all = "initial";
  document.documentElement.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

function buildPill(verdict: {
  verdict: Verdict;
  threatType: ScanResult["threatType"];
  url: string;
}): DocumentFragment {
  const tpl = document.createElement("template");
  const { icon, headline, detail, accent } = pillCopy(verdict);
  tpl.innerHTML = `
    <style>
      :host { all: initial; }
      .pill {
        position: fixed;
        z-index: 2147483646;
        max-width: 340px;
        background: #131a26;
        border: 1px solid #1f2735;
        border-radius: 14px;
        padding: 12px 14px;
        font-family:
          'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.3),
          0 8px 24px rgba(0, 0, 0, 0.45),
          0 24px 60px rgba(0, 0, 0, 0.5);
        pointer-events: none;
        animation: gp-pop 140ms cubic-bezier(0.16, 1, 0.3, 1);
        color: #e7ecf3;
      }
      @keyframes gp-pop {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .row { display: flex; align-items: center; gap: 10px; }
      .icon {
        flex-shrink: 0;
        width: 26px; height: 26px;
        border-radius: 50%;
        background: ${accent}1a;
        border: 1px solid ${accent}55;
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 14px; line-height: 1;
      }
      .headline {
        font-size: 13.5px;
        font-weight: 600;
        color: ${accent};
        letter-spacing: -0.01em;
      }
      .detail {
        font-size: 12.5px;
        color: #8a93a3;
        margin-top: 6px;
        line-height: 1.5;
      }
      .url {
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 11px;
        color: #6b7383;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #1f2735;
        word-break: break-all;
        max-width: 100%;
      }
    </style>
    <div class="pill" role="tooltip">
      <div class="row">
        <span class="icon" aria-hidden="true">${icon}</span>
        <span class="headline">${headline}</span>
      </div>
      <div class="detail">${detail}</div>
      <div class="url">${escapeHtml(verdict.url)}</div>
    </div>
  `;
  return tpl.content;
}

function pillCopy(v: {
  verdict: Verdict;
  threatType: ScanResult["threatType"];
}): { icon: string; headline: string; detail: string; accent: string } {
  switch (v.verdict) {
    case "safe":
      return {
        icon: "✓",
        headline: "Looks safe",
        detail:
          "Gone Phishin' checked this link and didn't find any signs of phishing.",
        accent: "#34d399",
      };
    case "unknown":
      return {
        icon: "🔍",
        headline: "Not verified",
        detail:
          "We couldn't check this link right now. Be careful — only click if you trust the sender.",
        accent: "#38bdf8",
      };
    case "sketchy":
      return {
        icon: "⚠",
        headline: "Looks suspicious",
        detail:
          v.threatType?.startsWith("heuristic_typosquat")
            ? "This link looks like a fake of a well-known brand. Don't click unless you're sure."
            : "Something about this link looks off. Don't click unless you're sure.",
        accent: "#fbbf24",
      };
    case "dangerous":
      return {
        icon: "🛑",
        headline: "Dangerous — don't click",
        detail:
          "Google flagged this link as a known phishing or malware page. Do not click.",
        accent: "#f87171",
      };
  }
}

function positionPill(pill: HTMLElement, anchor: HTMLAnchorElement) {
  const rect = anchor.getBoundingClientRect();
  // Render once invisibly to measure height, then position.
  pill.style.visibility = "hidden";
  pill.style.top = "0px";
  pill.style.left = "0px";
  requestAnimationFrame(() => {
    const cardRect = pill.getBoundingClientRect();
    const margin = 8;
    let top = rect.bottom + margin;
    if (top + cardRect.height > window.innerHeight) {
      top = Math.max(margin, rect.top - cardRect.height - margin);
    }
    let left = rect.left;
    if (left + cardRect.width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - cardRect.width - margin);
    }
    pill.style.top = `${top}px`;
    pill.style.left = `${left}px`;
    pill.style.visibility = "";
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
