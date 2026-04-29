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
  const { icon, headline, detail, color, bg } = pillCopy(verdict);
  tpl.innerHTML = `
    <style>
      :host { all: initial; }
      .pill {
        position: fixed;
        z-index: 2147483646;
        max-width: 360px;
        background: ${bg};
        color: #111;
        border: 2px solid ${color};
        border-radius: 14px;
        padding: 12px 16px;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 6px 20px rgba(0,0,0,.18);
        pointer-events: none;
        animation: gp-pop 120ms ease-out;
      }
      @keyframes gp-pop {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .row { display: flex; align-items: center; gap: 10px; }
      .icon { font-size: 22px; line-height: 1; }
      .headline {
        font-size: 16px;
        font-weight: 700;
        color: ${color};
      }
      .detail {
        font-size: 13px;
        color: #4b5563;
        margin-top: 4px;
        line-height: 1.4;
      }
      .url {
        font-size: 11px;
        color: #6b7280;
        margin-top: 6px;
        word-break: break-all;
        max-width: 100%;
      }
    </style>
    <div class="pill" role="tooltip">
      <div class="row">
        <span class="icon">${icon}</span>
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
}): {
  icon: string;
  headline: string;
  detail: string;
  color: string;
  bg: string;
} {
  switch (v.verdict) {
    case "safe":
      return {
        icon: "✅",
        headline: "Looks safe",
        detail: "Gone Phishin' checked this link and didn't find any signs of phishing.",
        color: "#15803d",
        bg: "#f0fdf4",
      };
    case "unknown":
      return {
        icon: "🔍",
        headline: "Not verified",
        detail:
          "We couldn't check this link right now. Be careful — only click if you trust the sender.",
        color: "#1d4ed8",
        bg: "#eff6ff",
      };
    case "sketchy":
      return {
        icon: "⚠️",
        headline: "Looks suspicious",
        detail:
          v.threatType?.startsWith("heuristic_typosquat") ?
            "This link looks like a fake of a well-known brand. Don't click unless you're sure." :
            "Something about this link looks off. Don't click unless you're sure.",
        color: "#b45309",
        bg: "#fffbeb",
      };
    case "dangerous":
      return {
        icon: "🚫",
        headline: "Dangerous — don't click",
        detail:
          "Google flagged this link as a known phishing or malware page. Do not click.",
        color: "#b91c1c",
        bg: "#fef2f2",
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
