import type { ScanResult } from "@gonephishin/shared";

export type ModalOutcome = "dismissed" | "ignored_warning";

let host: HTMLElement | null = null;

/**
 * Inject a shadow-DOM-isolated full-page modal and resolve when the user
 * picks an action. Re-uses one host element per page.
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
  const headline = isDanger
    ? "Stop! This link looks dangerous."
    : "Hold on — this link looks suspicious.";
  const detail = isDanger
    ? "It may be trying to steal your password or install something harmful."
    : "Something about this link doesn't look right. We can't be sure it's safe.";
  tpl.innerHTML = `
    <style>
      :host { all: initial; }
      .backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,.6);
        z-index: 2147483647; display: grid; place-items: center;
        font-family: system-ui, sans-serif; color: #111;
      }
      .card {
        background: white; border-radius: 12px; padding: 24px;
        max-width: 480px; box-shadow: 0 10px 30px rgba(0,0,0,.3);
        text-align: center;
      }
      h1 { font-size: 22px; margin: 0 0 12px; color: ${isDanger ? "#b91c1c" : "#b45309"}; }
      p { font-size: 16px; line-height: 1.5; margin: 0 0 8px; }
      .url {
        font-size: 13px; word-break: break-all; color: #444;
        background: #f3f4f6; padding: 8px; border-radius: 6px; margin: 12px 0 20px;
      }
      .actions { display: flex; flex-direction: column; gap: 8px; }
      button { font-size: 16px; padding: 12px; border-radius: 8px; cursor: pointer; border: 0; }
      .primary { background: #15803d; color: white; font-weight: 600; }
      .secondary { background: transparent; color: #6b7280; font-size: 13px; text-decoration: underline; }
    </style>
    <div class="backdrop" role="dialog" aria-modal="true" aria-labelledby="gp-h">
      <div class="card">
        <h1 id="gp-h">${headline}</h1>
        <p>${detail}</p>
        <div class="url">${escapeHtml(verdict.url)}</div>
        <div class="actions">
          <button class="primary" data-action="back">Go Back (Recommended)</button>
          <button class="secondary" data-action="continue">Continue Anyway</button>
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
