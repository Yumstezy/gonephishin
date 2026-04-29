/**
 * User-tunable behavior of the extension. Lives in chrome.storage.local
 * under the key "settings". All callers should read via getSettings() —
 * never read storage directly so defaults stay consistent.
 */
export type Verbosity = "minimal" | "standard" | "verbose";

export interface ExtensionSettings {
  enabled: boolean;
  verbosity: Verbosity;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  verbosity: "standard",
};

const KEY = "settings";

export async function getSettings(): Promise<ExtensionSettings> {
  const obj = (await chrome.storage.local.get(KEY)) as {
    settings?: Partial<ExtensionSettings>;
  };
  return { ...DEFAULT_SETTINGS, ...(obj.settings ?? {}) };
}

export async function setSettings(
  partial: Partial<ExtensionSettings>,
): Promise<ExtensionSettings> {
  const current = await getSettings();
  const next: ExtensionSettings = { ...current, ...partial };
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}

/** Verbosity rules — keep these in one place so painter + tooltip agree. */
export function shouldPaintAlways(
  verdict: "safe" | "unknown" | "sketchy" | "dangerous",
  verbosity: Verbosity,
): boolean {
  switch (verbosity) {
    case "minimal":
      return verdict === "sketchy" || verdict === "dangerous";
    case "standard":
      return verdict !== "safe";
    case "verbose":
      return true;
  }
}
