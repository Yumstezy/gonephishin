import type { Diagnostics } from "../shared/messages.js";

const KEY = "diagnostics";

const empty: Diagnostics = {
  lastScanAt: null,
  totalScanned: 0,
  totalFlagged: 0,
  lastError: null,
  apiReachable: false,
};

export async function getDiagnostics(): Promise<Diagnostics> {
  const obj = (await chrome.storage.session.get(KEY)) as {
    diagnostics?: Partial<Diagnostics>;
  };
  return { ...empty, ...(obj.diagnostics ?? {}) };
}

export async function recordScan(opts: {
  scanned: number;
  flagged: number;
  apiReachable: boolean;
  error?: string | null;
}): Promise<void> {
  const cur = await getDiagnostics();
  const next: Diagnostics = {
    lastScanAt: Date.now(),
    totalScanned: cur.totalScanned + opts.scanned,
    totalFlagged: cur.totalFlagged + opts.flagged,
    lastError: opts.error ?? (opts.apiReachable ? null : cur.lastError),
    apiReachable: opts.apiReachable,
  };
  await chrome.storage.session.set({ [KEY]: next });
}
