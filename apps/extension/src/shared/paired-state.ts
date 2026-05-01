/**
 * Persisted pairing state — survives service worker restarts because it
 * lives in chrome.storage.local. Written by:
 *  - CodePairingScreen after a successful /api/pair/redeem
 *  - The service worker's onMessageExternal listener when the web app's
 *    /extension/activate page hands a token over via runtime.sendMessage
 */
const KEY = "paired";

export interface PairedState {
  token: string;
  circleId: string;
  label: string;
}

export async function getPairedState(): Promise<PairedState | null> {
  const obj = (await chrome.storage.local.get(KEY)) as { paired?: PairedState };
  return obj.paired ?? null;
}

export async function setPairedState(state: PairedState | null): Promise<void> {
  if (state === null) await chrome.storage.local.remove(KEY);
  else await chrome.storage.local.set({ [KEY]: state });
}
