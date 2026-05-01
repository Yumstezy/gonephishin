"use client";

import { useState } from "react";

/**
 * Generate-and-display surface for a circle's 6-digit pairing code.
 * Renders inside an .app-card; the family-add row at the bottom holds
 * the action buttons. Match the marketing site's dark dashboard style.
 */
export function PairingCodeDisplay({ circleId }: { circleId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pair/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId }),
      });
      if (!res.ok) throw new Error(`got ${res.status}`);
      const data = (await res.json()) as { code: string; expiresAt: string };
      setCode(data.code);
      setExpiresAt(new Date(data.expiresAt));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard refusal is non-fatal */
    }
  }

  return (
    <>
      {code ? (
        <div className="pair-row">
          <div>
            <div className="lbl">Pairing code</div>
            <div className="code">{formatCode(code)}</div>
            {expiresAt && (
              <div className="meta">
                Expires {expiresAt.toLocaleTimeString()}
              </div>
            )}
          </div>
          <button className="copy" onClick={copy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      ) : (
        <div className="empty" style={{ padding: "20px" }}>
          No active pairing code. Generate one and read it to your family
          member over the phone.
        </div>
      )}
      <div className="family-add">
        <button
          className="app-btn app-btn-primary"
          onClick={generate}
          disabled={loading}
        >
          {loading ? "Generating…" : code ? "New code" : "Generate code"}
        </button>
        {error && (
          <span style={{ fontSize: 12.5, color: "rgb(var(--danger))" }}>
            {error}
          </span>
        )}
      </div>
    </>
  );
}

function formatCode(c: string): string {
  // 492718 → "4 9 2 — 7 1 8" — same shape as the design.
  const a = c.slice(0, 3).split("").join(" ");
  const b = c.slice(3).split("").join(" ");
  return `${a} — ${b}`;
}
