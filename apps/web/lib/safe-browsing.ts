import type { ThreatType, Verdict } from "@gonephishin/shared";

const ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find";

interface ApiMatch {
  threatType: string;
  threat: { url: string };
}

interface ApiResponse {
  matches?: ApiMatch[];
}

const THREAT_MAP: Record<string, ThreatType> = {
  MALWARE: "sb_malware",
  SOCIAL_ENGINEERING: "sb_social_engineering",
  UNWANTED_SOFTWARE: "sb_unwanted_software",
  POTENTIALLY_HARMFUL_APPLICATION: "sb_potentially_harmful_application",
};

export interface SbVerdict {
  url: string;
  verdict: Verdict;
  threatType: ThreatType;
}

export async function lookupSafeBrowsing(
  urls: string[],
): Promise<Map<string, SbVerdict>> {
  const result = new Map<string, SbVerdict>();
  if (urls.length === 0) return result;

  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  if (!apiKey) throw new Error("SAFE_BROWSING_API_KEY is not set");

  const body = {
    client: { clientId: "gonephishin", clientVersion: "0.1.0" },
    threatInfo: {
      threatTypes: Object.keys(THREAT_MAP),
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: urls.map((url) => ({ url })),
    },
  };

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Safe Browsing returned ${res.status}`);
  }
  const data = (await res.json()) as ApiResponse;

  // Default every input URL to safe; matches override.
  for (const url of urls) {
    result.set(url, {
      url,
      verdict: "safe" satisfies Verdict,
      threatType: null,
    });
  }
  for (const match of data.matches ?? []) {
    const url = match.threat.url;
    const mapped = THREAT_MAP[match.threatType] ?? null;
    result.set(url, {
      url,
      verdict: "dangerous" satisfies Verdict,
      threatType: mapped,
    });
  }
  return result;
}
