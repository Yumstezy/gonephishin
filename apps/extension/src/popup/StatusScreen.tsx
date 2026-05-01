import { useEffect, useState } from "react";
import type { Diagnostics } from "../shared/messages.js";
import type { PairedState } from "../shared/paired-state.js";

export function StatusScreen({
  paired,
  onUnpair,
}: {
  paired: PairedState | null;
  onUnpair: () => void;
}) {
  const [diag, setDiag] = useState<Diagnostics | null>(null);

  useEffect(() => {
    let cancelled = false;
    const refresh = () =>
      chrome.runtime
        .sendMessage({ type: "get-diagnostics" })
        .then((d) => {
          if (!cancelled) setDiag(d as Diagnostics);
        })
        .catch(() => {
          /* ignore */
        });
    void refresh();
    const id = setInterval(refresh, 1500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>You&apos;re protected</h1>
      <p>Gone Phishin&apos; is checking links in Gmail and Outlook.</p>

      <div className="status">
        {paired ? (
          <>
            Paired with <strong>{paired.label}</strong>.
          </>
        ) : (
          <>
            Anonymous mode. Pair below to share danger events with family or
            your own dashboard.
          </>
        )}
      </div>

      <div className="diag">
        <div className="diag-row">
          <span className="lbl">Status</span>
          <span className={`val ${diagTone(diag)}`}>{diagLabel(diag)}</span>
        </div>
        <div className="diag-row">
          <span className="lbl">Links checked</span>
          <span className="val">{diag?.totalScanned ?? 0}</span>
        </div>
        <div className="diag-row">
          <span className="lbl">Flagged</span>
          <span className="val">{diag?.totalFlagged ?? 0}</span>
        </div>
        {diag?.lastError && (
          <div className="diag-error">⚠ {diag.lastError}</div>
        )}
      </div>

      {paired && (
        <button className="button button-ghost" onClick={onUnpair}>
          Unpair this browser
        </button>
      )}
    </>
  );
}

function diagLabel(d: Diagnostics | null): string {
  if (!d || d.lastScanAt === null) return "Waiting for an inbox";
  const ago = secondsAgo(d.lastScanAt);
  if (!d.apiReachable) return `Can't reach our server`;
  return `Active · last check ${ago}`;
}

function diagTone(d: Diagnostics | null): "" | "warn" | "ok" {
  if (!d || d.lastScanAt === null) return "";
  if (!d.apiReachable) return "warn";
  return "ok";
}

function secondsAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}
