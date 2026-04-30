import type { ScanResult } from "@gonephishin/shared";

export type ModalOutcome = "dismissed" | "ignored_warning";

let host: HTMLElement | null = null;

/**
 * Inject a shadow-DOM-isolated full-page modal and resolve when the user
 * picks an action. Re-uses one host element per page.
 *
 * Visual: matches the marketing site's dark Glowing Sky theme — slate
 * surface card, sky-blue brand mark, coral danger headline, primary
 * "Go back" button, ghost "Continue anyway" link. The URL is shown in
 * a monospace pill so the user can verify it before deciding.
 */
export function showWarningModal(verdict: ScanResult): Promise<ModalOutcome> {
  const root = ensureHost();
  return new Promise<ModalOutcome>((resolve) => {
    root.innerHTML = "";
    root.appendChild(buildContent(verdict, resolve));
  });
}

function ensureHost(): ShadowRoot {
  if (host) return host.shadowRoot!;
  host = document.createElement("div");
  host.id = "gonephishin-modal-host";
  host.style.all = "initial";
  document.documentElement.appendChild(host);
  return host.attachShadow({ mode: "open" });
}

function buildContent(
  verdict: ScanResult,
  resolve: (o: ModalOutcome) => void,
): DocumentFragment {
  const tpl = document.createElement("template");
  const isDanger = verdict.verdict === "dangerous";
  const headline = isDanger ? "Dangerous link" : "Suspicious link";
  const subhead = isDanger
    ? "This page may try to steal your password, your money, or your identity."
    : "Something about this link doesn't look right. We can't be sure it's safe.";
  const accent = isDanger ? "#f87171" : "#fbbf24";

  tpl.innerHTML = `
    <style>
      :host { all: initial; }
      .backdrop {
        position: fixed; inset: 0;
        z-index: 2147483647;
        display: grid; place-items: center;
        padding: 24px;
        background:
          radial-gradient(ellipse 800px 600px at 50% 20%, rgba(56, 189, 248, 0.10), transparent 65%),
          rgba(8, 12, 20, 0.78);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', Geist, system-ui, sans-serif;
        color: #e7ecf3;
        animation: fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .card {
        width: 100%;
        max-width: 460px;
        background: #131a26;
        border: 1px solid #1f2735;
        border-radius: 18px;
        padding: 28px 28px 24px;
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.4),
          0 12px 32px rgba(0, 0, 0, 0.55),
          0 32px 80px rgba(0, 0, 0, 0.6);
        animation: pop 220ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes pop {
        from { opacity: 0; transform: translateY(8px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      .brand {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #6b7383;
        margin-bottom: 18px;
      }
      .brand .dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: #38bdf8;
        box-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
      }
      .head {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 8px;
      }
      .icon {
        width: 38px; height: 38px;
        border-radius: 50%;
        background: ${isDanger ? "rgba(248, 113, 113, 0.12)" : "rgba(251, 191, 36, 0.12)"};
        border: 1px solid ${isDanger ? "rgba(248, 113, 113, 0.3)" : "rgba(251, 191, 36, 0.3)"};
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        color: ${accent};
      }
      h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.02em;
        color: ${accent};
        line-height: 1.2;
      }
      p {
        margin: 0;
        font-size: 14.5px;
        color: #8a93a3;
        line-height: 1.55;
      }
      .url {
        margin: 18px 0 22px;
        padding: 10px 12px;
        background: #0b0f17;
        border: 1px solid #1f2735;
        border-radius: 8px;
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 12.5px;
        color: #e7ecf3;
        word-break: break-all;
        line-height: 1.5;
      }
      .verdict-stamp {
        display: inline-block;
        margin-bottom: 6px;
        padding: 3px 8px;
        border-radius: 4px;
        background: ${isDanger ? "rgba(248, 113, 113, 0.12)" : "rgba(251, 191, 36, 0.12)"};
        border: 1px solid ${isDanger ? "rgba(248, 113, 113, 0.35)" : "rgba(251, 191, 36, 0.35)"};
        font-family: 'Geist Mono', ui-monospace, monospace;
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: ${accent};
        font-weight: 600;
      }
      .actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .primary {
        height: 44px;
        background: #e7ecf3;
        color: #0b0f17;
        border: 0;
        border-radius: 999px;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: -0.01em;
        cursor: pointer;
        transition: transform .12s, background-color .15s;
        font-family: inherit;
      }
      .primary:hover {
        background: white;
        transform: translateY(-1px);
      }
      .primary:active { transform: translateY(0); }
      .secondary {
        height: 36px;
        background: transparent;
        color: #6b7383;
        border: 0;
        font-size: 13px;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 3px;
        font-family: inherit;
      }
      .secondary:hover { color: #8a93a3; }
    </style>

    <div class="backdrop" role="dialog" aria-modal="true" aria-labelledby="gp-h">
      <div class="card">
        <div class="brand">
          <span class="dot"></span>
          Gone Phishin'
        </div>

        <span class="verdict-stamp">${isDanger ? "Dangerous" : "Suspicious"}</span>

        <div class="head">
          <span class="icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </span>
          <h1 id="gp-h">${headline}</h1>
        </div>

        <p>${subhead}</p>

        <div class="url">${escapeHtml(verdict.url)}</div>

        <div class="actions">
          <button class="primary" data-action="back" type="button">
            Go back
          </button>
          <button class="secondary" data-action="continue" type="button">
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  `;
  const frag = tpl.content;
  frag.querySelector('[data-action="back"]')!.addEventListener("click", () => {
    cleanup();
    resolve("dismissed");
  });
  frag
    .querySelector('[data-action="continue"]')!
    .addEventListener("click", () => {
      cleanup();
      resolve("ignored_warning");
    });
  return frag;
}

function cleanup() {
  if (host) host.shadowRoot!.innerHTML = "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
