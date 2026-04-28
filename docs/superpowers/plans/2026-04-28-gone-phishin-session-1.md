# Gone Phishin' — Session 1 Implementation Plan (v0.1a)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a working Chrome extension that scans Gmail and Outlook.com for phishing links via a Vercel-hosted `/api/scan` backend, mark links by safety status, and intercept clicks on dangerous links with a warning modal — all in anonymous mode, no pairing required.

**Architecture:** Turborepo monorepo. `apps/web` is a Next.js 16 App Router app on Vercel that proxies the Google Safe Browsing Lookup API v4 (with a 6-hour Postgres verdict cache and local heuristic pre-checks). `apps/extension` is a Manifest V3 Chrome extension built with Vite + CRXJS; its service worker calls `/api/scan` and content scripts (one per supported site) paint links and intercept dangerous clicks.

**Tech Stack:** TypeScript, Next.js 16, Tailwind CSS, Drizzle ORM + Neon Postgres, Vitest, Vite + CRXJS for the extension, React 19 for the popup, pnpm workspaces, Turborepo.

---

## Files Created in This Session

```
gonephishin/
├── package.json                              # workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .gitignore
├── .nvmrc
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.mjs
│   │   ├── drizzle.config.ts
│   │   ├── vitest.config.ts
│   │   ├── .env.example
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   └── api/scan/route.ts
│   │   └── lib/
│   │       ├── db/
│   │       │   ├── schema.ts
│   │       │   ├── client.ts
│   │       │   └── migrate.ts
│   │       ├── url-normalize.ts
│   │       ├── url-normalize.test.ts
│   │       ├── heuristics.ts
│   │       ├── heuristics.test.ts
│   │       ├── safe-browsing.ts
│   │       ├── safe-browsing.test.ts
│   │       ├── scan-cache.ts
│   │       ├── rate-limit.ts
│   │       └── rate-limit.test.ts
│   └── extension/
│       ├── package.json
│       ├── manifest.config.ts                # CRXJS dynamic manifest
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       ├── .env.example
│       └── src/
│           ├── background/
│           │   ├── service-worker.ts
│           │   ├── cache.ts
│           │   ├── cache.test.ts
│           │   └── api-client.ts
│           ├── content/
│           │   ├── index.ts
│           │   ├── content.css
│           │   ├── shared/
│           │   │   ├── site-adapter.ts
│           │   │   ├── url-skip.ts
│           │   │   ├── url-skip.test.ts
│           │   │   ├── link-scanner.ts
│           │   │   ├── link-painter.ts
│           │   │   ├── click-guard.ts
│           │   │   └── warning-modal.ts
│           │   └── sites/
│           │       ├── gmail.ts
│           │       └── outlook.ts
│           ├── popup/
│           │   ├── index.html
│           │   ├── main.tsx
│           │   ├── App.tsx
│           │   ├── ChooseModeScreen.tsx
│           │   ├── StatusScreen.tsx
│           │   └── popup.css
│           └── shared/
│               ├── messages.ts
│               └── env.ts
└── packages/
    └── shared/
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts
            ├── verdict.ts
            └── api.ts
```

---

## Task 1: Repository scaffold and tooling baseline

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `.gitignore`, `.nvmrc`

- [ ] **Step 1: Add `.nvmrc` pinning Node 24 LTS**

```
24
```

- [ ] **Step 2: Add `.gitignore`**

```
node_modules
.next
dist
.turbo
.env
.env.local
.env.*.local
!*.example
*.log
.DS_Store
.vercel
coverage
```

- [ ] **Step 3: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Create root `package.json`**

```json
{
  "name": "gonephishin",
  "private": true,
  "version": "0.1.0",
  "packageManager": "pnpm@9.12.0",
  "engines": { "node": ">=24" },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.2.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 5: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["^build"] },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

- [ ] **Step 6: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "jsx": "preserve",
    "types": []
  }
}
```

- [ ] **Step 7: Install root deps and verify Turbo runs**

```bash
pnpm install
pnpm turbo --help
```

Expected: pnpm reports installation success; `turbo --help` prints command list.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: scaffold turborepo workspace"
```

---

## Task 2: Shared types package

**Files:**
- Create: `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/src/index.ts`, `packages/shared/src/verdict.ts`, `packages/shared/src/api.ts`

- [ ] **Step 1: Create `packages/shared/package.json`**

```json
{
  "name": "@gonephishin/shared",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create `packages/shared/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `packages/shared/src/verdict.ts`**

```ts
export const VERDICT = {
  Safe: "safe",
  Unknown: "unknown",
  Sketchy: "sketchy",
  Dangerous: "dangerous",
} as const;

export type Verdict = (typeof VERDICT)[keyof typeof VERDICT];

// Reasons a verdict can be issued. 'sb_*' come from Google Safe Browsing's
// threatType enum; 'heuristic_*' are produced locally by our pre-check.
export type ThreatType =
  | "sb_malware"
  | "sb_social_engineering"
  | "sb_unwanted_software"
  | "sb_potentially_harmful_application"
  | "heuristic_typosquat"
  | "heuristic_idn_homoglyph"
  | "heuristic_suspicious_tld"
  | "heuristic_ip_address"
  | "heuristic_excessive_subdomains"
  | null;

export type VerdictSource = "fresh" | "cache" | "fallback" | "heuristic";
```

- [ ] **Step 4: Create `packages/shared/src/api.ts`**

```ts
import type { ThreatType, Verdict, VerdictSource } from "./verdict.js";

export interface ScanRequest {
  urls: string[];
}

export interface ScanResult {
  url: string;
  verdict: Verdict;
  threatType: ThreatType;
  source: VerdictSource;
}

export interface ScanResponse {
  results: ScanResult[];
  // True when the request was authenticated with a non-revoked extension
  // token. Lets the popup react to revocations even when scanning anonymously.
  paired: boolean;
}
```

- [ ] **Step 5: Create `packages/shared/src/index.ts`**

```ts
export * from "./verdict.js";
export * from "./api.js";
```

- [ ] **Step 6: Verify the package typechecks**

```bash
pnpm --filter @gonephishin/shared typecheck
```

Expected: no output, exit code 0.

- [ ] **Step 7: Commit**

```bash
git add packages/shared
git commit -m "feat(shared): add Verdict and API types"
```

---

## Task 3: Web app scaffold (Next.js 16)

**Files:**
- Create: `apps/web/package.json`, `apps/web/next.config.ts`, `apps/web/tsconfig.json`, `apps/web/tailwind.config.ts`, `apps/web/postcss.config.mjs`, `apps/web/.env.example`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, `apps/web/app/globals.css`

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "@gonephishin/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbo --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx lib/db/migrate.ts"
  },
  "dependencies": {
    "@gonephishin/shared": "workspace:*",
    "drizzle-orm": "^0.36.0",
    "next": "^16.0.0",
    "postgres": "^3.4.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.7.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.28.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `apps/web/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    },
    "noEmit": true,
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `apps/web/next.config.ts`**

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Allow the extension to call /api/scan from any origin during development.
  // Production CORS is intentionally open on /api/scan because the extension
  // ships to many users and there is no per-user origin to allow-list.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default config;
```

- [ ] **Step 4: Create `apps/web/tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 5: Create `apps/web/postcss.config.mjs`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create `apps/web/.env.example`**

```
# Neon Postgres connection string from the Vercel Marketplace integration.
# Format: postgres://user:pass@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
DATABASE_URL=

# Google Safe Browsing API key (https://console.cloud.google.com/apis/credentials).
# Required scopes: Safe Browsing API enabled on the project.
SAFE_BROWSING_API_KEY=
```

- [ ] **Step 7: Create `apps/web/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Create `apps/web/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gone Phishin'",
  description: "Protect yourself, or someone you love, from phishing scams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Create `apps/web/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Gone Phishin'</h1>
        <p className="text-lg text-gray-600">
          Protection from phishing links. The marketing page lands here in
          Session 2.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 10: Install deps and verify dev server boots**

```bash
pnpm install
pnpm --filter @gonephishin/web dev
```

Expected: terminal shows `▲ Next.js 16.x` and `Local: http://localhost:3000`. Open it in a browser; the placeholder page renders. Stop the dev server with Ctrl+C.

- [ ] **Step 11: Commit**

```bash
git add apps/web pnpm-lock.yaml
git commit -m "feat(web): scaffold Next.js 16 app with placeholder page"
```

---

## Task 4: URL normalization (web)

URL normalization gives every URL a canonical string form before hashing for the cache and before sending to Safe Browsing. Two equivalent URLs (e.g. `HTTP://EXAMPLE.com` vs `http://example.com/`) must hash to the same key.

**Files:**
- Create: `apps/web/lib/url-normalize.ts`, `apps/web/lib/url-normalize.test.ts`, `apps/web/vitest.config.ts`

- [ ] **Step 1: Create `apps/web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Write failing tests in `apps/web/lib/url-normalize.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { normalizeUrl } from "./url-normalize.js";

describe("normalizeUrl", () => {
  it("lowercases the host and drops the default port", () => {
    expect(normalizeUrl("HTTP://Example.COM:80/Path")).toBe(
      "http://example.com/Path",
    );
  });

  it("preserves path case but strips fragment", () => {
    expect(normalizeUrl("https://example.com/Foo#bar")).toBe(
      "https://example.com/Foo",
    );
  });

  it("collapses repeated slashes in the path", () => {
    expect(normalizeUrl("https://example.com//foo///bar")).toBe(
      "https://example.com/foo/bar",
    );
  });

  it("decodes safe percent-encoding in the path", () => {
    expect(normalizeUrl("https://example.com/%7Euser")).toBe(
      "https://example.com/~user",
    );
  });

  it("converts IDN host to punycode", () => {
    expect(normalizeUrl("https://пример.испытание/")).toBe(
      "https://xn--e1afmkfd.xn--80akhbyknj4f/",
    );
  });

  it("throws for non-http(s) schemes", () => {
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow();
    expect(() => normalizeUrl("mailto:a@b.com")).toThrow();
  });
});
```

- [ ] **Step 3: Run the tests to confirm they fail**

```bash
pnpm --filter @gonephishin/web test url-normalize
```

Expected: FAIL with "Cannot find module './url-normalize.js'".

- [ ] **Step 4: Implement `apps/web/lib/url-normalize.ts`**

```ts
const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
};

/**
 * Canonicalize a URL so that equivalent URLs produce the same string.
 * Throws for non-http(s) schemes — those should be filtered earlier.
 */
export function normalizeUrl(input: string): string {
  const u = new URL(input);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error(`unsupported scheme: ${u.protocol}`);
  }

  // URL parser already lowercases the protocol and applies IDN→punycode.
  // We need to normalize host casing, default ports, path slashes, and drop
  // the fragment.
  if (u.port === DEFAULT_PORTS[u.protocol]) u.port = "";

  const collapsedPath = u.pathname.replace(/\/{2,}/g, "/") || "/";
  u.pathname = collapsedPath
    .split("/")
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .map(encodeUriPathSegment)
    .join("/");

  u.hash = "";
  return u.toString();
}

/**
 * Re-encode a path segment with the same rules the URL parser uses, but with
 * tilde and a few other safe characters left as-is so that decoded forms stay
 * decoded.
 */
function encodeUriPathSegment(segment: string): string {
  return segment.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@/]/g, (ch) =>
    encodeURIComponent(ch),
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm --filter @gonephishin/web test url-normalize
```

Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib/url-normalize.ts apps/web/lib/url-normalize.test.ts apps/web/vitest.config.ts
git commit -m "feat(web): add URL normalization with vitest tests"
```

---

## Task 5: Heuristic URL pre-check (web)

The heuristics produce a verdict locally — fast, free, and catches some attacks before they hit Safe Browsing. Spec §9 lists: typosquatting, IDN homoglyphs, suspicious TLDs, IP-address URLs, excessive subdomains.

**Files:**
- Create: `apps/web/lib/heuristics.ts`, `apps/web/lib/heuristics.test.ts`

- [ ] **Step 1: Write failing tests in `apps/web/lib/heuristics.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { checkHeuristics } from "./heuristics.js";

describe("checkHeuristics", () => {
  it("returns null for a clean popular domain", () => {
    expect(checkHeuristics("https://www.google.com/")).toBeNull();
  });

  it("flags an IP-address host", () => {
    expect(checkHeuristics("http://192.168.1.1/login")).toEqual({
      threatType: "heuristic_ip_address",
    });
  });

  it("flags a host with mixed Latin and Cyrillic characters (homoglyph)", () => {
    // 'а' here is U+0430 Cyrillic
    expect(checkHeuristics("https://раypal.com/login")).toEqual({
      threatType: "heuristic_idn_homoglyph",
    });
  });

  it("flags suspicious TLDs", () => {
    expect(checkHeuristics("https://account-verify.tk/login")).toEqual({
      threatType: "heuristic_suspicious_tld",
    });
  });

  it("flags excessive subdomain depth", () => {
    expect(
      checkHeuristics("https://login.account.security.update.example.com/"),
    ).toEqual({ threatType: "heuristic_excessive_subdomains" });
  });

  it("flags typosquats of well-known brands", () => {
    expect(checkHeuristics("https://paypa1.com/")).toEqual({
      threatType: "heuristic_typosquat",
    });
    expect(checkHeuristics("https://g00gle.com/")).toEqual({
      threatType: "heuristic_typosquat",
    });
  });

  it("does not flag the brand itself", () => {
    expect(checkHeuristics("https://paypal.com/")).toBeNull();
    expect(checkHeuristics("https://www.google.com/")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
pnpm --filter @gonephishin/web test heuristics
```

Expected: FAIL — "Cannot find module './heuristics.js'".

- [ ] **Step 3: Implement `apps/web/lib/heuristics.ts`**

```ts
import type { ThreatType } from "@gonephishin/shared";

/**
 * Local heuristics that flag a URL without consulting Safe Browsing.
 * Returns null when nothing is suspicious; returns a threatType otherwise.
 */
export function checkHeuristics(
  url: string,
): { threatType: NonNullable<ThreatType> } | null {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }

  if (isIpAddress(host)) return { threatType: "heuristic_ip_address" };
  if (hasMixedScripts(host)) return { threatType: "heuristic_idn_homoglyph" };
  if (hasSuspiciousTld(host)) return { threatType: "heuristic_suspicious_tld" };
  if (hasExcessiveSubdomains(host))
    return { threatType: "heuristic_excessive_subdomains" };
  if (looksLikeTyposquat(host)) return { threatType: "heuristic_typosquat" };
  return null;
}

function isIpAddress(host: string): boolean {
  return (
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) ||
    (host.startsWith("[") && host.endsWith("]")) // IPv6 literal
  );
}

/**
 * A host with characters from more than one Unicode script (e.g. Latin +
 * Cyrillic) is almost always a homoglyph attack. We allow ASCII-only and
 * single-script-only hosts.
 */
function hasMixedScripts(host: string): boolean {
  // Any non-ASCII characters present?
  if (/^[\x00-\x7F]+$/.test(host)) return false;
  let sawLatin = false;
  let sawCyrillic = false;
  let sawGreek = false;
  for (const ch of host) {
    const code = ch.codePointAt(0)!;
    if ((code >= 0x0041 && code <= 0x005a) || (code >= 0x0061 && code <= 0x007a))
      sawLatin = true;
    else if (code >= 0x0400 && code <= 0x04ff) sawCyrillic = true;
    else if (code >= 0x0370 && code <= 0x03ff) sawGreek = true;
  }
  const scriptCount = [sawLatin, sawCyrillic, sawGreek].filter(Boolean).length;
  return scriptCount > 1;
}

const SUSPICIOUS_TLDS = new Set([
  "tk",
  "ml",
  "ga",
  "cf",
  "gq",
  "xyz",
  "top",
  "click",
  "country",
  "stream",
  "download",
  "bid",
  "loan",
  "men",
  "work",
  "racing",
]);

function hasSuspiciousTld(host: string): boolean {
  const tld = host.split(".").at(-1)?.toLowerCase();
  return tld ? SUSPICIOUS_TLDS.has(tld) : false;
}

function hasExcessiveSubdomains(host: string): boolean {
  // Most legitimate hosts have 2-3 labels (e.g. example.com, www.example.com,
  // mail.google.com). 5+ is a phishing red flag.
  return host.split(".").length >= 5;
}

const PROTECTED_BRANDS = [
  "google",
  "paypal",
  "amazon",
  "microsoft",
  "apple",
  "facebook",
  "netflix",
  "chase",
  "wellsfargo",
  "bankofamerica",
  "citibank",
  "americanexpress",
  "instagram",
  "linkedin",
];

/**
 * A host "typosquats" a brand if its second-level label is within edit
 * distance 1 of a brand name AND is not the brand itself.
 */
function looksLikeTyposquat(host: string): boolean {
  const labels = host.toLowerCase().split(".");
  if (labels.length < 2) return false;
  const candidate = labels[labels.length - 2]!;
  for (const brand of PROTECTED_BRANDS) {
    if (candidate === brand) return false;
    if (levenshtein(candidate, brand) === 1) return true;
  }
  return false;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n]!;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter @gonephishin/web test heuristics
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/heuristics.ts apps/web/lib/heuristics.test.ts
git commit -m "feat(web): add local URL heuristics with brand typosquat detection"
```

---

## Task 6: Database schema and client (Drizzle + Neon)

For Session 1 we only need one table: `scan_cache`. Other tables come in Session 2.

**Files:**
- Create: `apps/web/lib/db/schema.ts`, `apps/web/lib/db/client.ts`, `apps/web/lib/db/migrate.ts`, `apps/web/drizzle.config.ts`

- [ ] **Step 1: Create `apps/web/drizzle.config.ts`**

```ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

- [ ] **Step 2: Create `apps/web/lib/db/schema.ts`**

```ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const scanCache = pgTable("scan_cache", {
  // sha256 hex of the normalized URL — produced by url-normalize then hashed
  urlHash: text("url_hash").primaryKey(),
  verdict: text("verdict").notNull(),
  threatType: text("threat_type"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type ScanCacheRow = typeof scanCache.$inferSelect;
```

- [ ] **Step 3: Create `apps/web/lib/db/client.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Pull it with `vercel env pull` or copy from .env.example.",
  );
}

// `prepare: false` is required for the Neon serverless pooler.
const client = postgres(connectionString, { prepare: false, max: 5 });
export const db = drizzle(client, { schema });
```

- [ ] **Step 4: Create `apps/web/lib/db/migrate.ts`**

```ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Migrations applied.");
await sql.end();
```

- [ ] **Step 5: Add `dotenv` and generate the first migration**

```bash
pnpm --filter @gonephishin/web add dotenv
pnpm --filter @gonephishin/web db:generate
```

Expected: Drizzle creates a numbered SQL migration in `apps/web/drizzle/0000_xxx.sql`. Inspect it to confirm it creates the `scan_cache` table.

- [ ] **Step 6: Provision Neon Postgres via the Vercel Marketplace and pull env**

Run these commands and follow the interactive prompts.

```bash
# Authenticate the Vercel CLI if you haven't already.
vercel login

# Link this directory to a Vercel project (create a new one when prompted).
cd apps/web && vercel link

# Open the Marketplace in your browser, install Neon, attach to the project.
# Easiest path: the dashboard at vercel.com/<team>/<project>/integrations.

# Once attached, pull the env into apps/web/.env.local.
vercel env pull .env.local
cd ../..
```

Expected: `apps/web/.env.local` now contains `DATABASE_URL=postgres://...` from Neon. Verify with `grep DATABASE_URL apps/web/.env.local`.

- [ ] **Step 7: Run migrations**

```bash
pnpm --filter @gonephishin/web db:migrate
```

Expected: console prints "Migrations applied." Connect to the DB (e.g. via the Neon dashboard) and confirm the `scan_cache` table exists with the right columns.

- [ ] **Step 8: Commit**

```bash
git add apps/web/lib/db apps/web/drizzle.config.ts apps/web/drizzle apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): add scan_cache schema with Drizzle and Neon Postgres"
```

---

## Task 7: scan_cache read/write helpers

**Files:**
- Create: `apps/web/lib/scan-cache.ts`

- [ ] **Step 1: Implement `apps/web/lib/scan-cache.ts`**

```ts
import { createHash } from "node:crypto";
import { and, gt, inArray } from "drizzle-orm";
import type { ThreatType, Verdict } from "@gonephishin/shared";
import { db } from "./db/client.js";
import { scanCache } from "./db/schema.js";
import { normalizeUrl } from "./url-normalize.js";

const TTL_MS = 6 * 60 * 60 * 1000; // 6h per spec §3 / §6

export function urlHash(url: string): string {
  // We hash the normalized form so URL aliasing collapses to one cache entry.
  const normalized = normalizeUrl(url);
  return createHash("sha256").update(normalized).digest("hex");
}

export interface CachedVerdict {
  url: string;
  verdict: Verdict;
  threatType: ThreatType;
}

/** Returns a map keyed by the original (unnormalized) URL. */
export async function lookupCache(
  urls: string[],
): Promise<Map<string, CachedVerdict>> {
  const result = new Map<string, CachedVerdict>();
  if (urls.length === 0) return result;

  // Build hash → original url map so we can return results keyed by input.
  const hashToUrl = new Map<string, string>();
  for (const u of urls) {
    try {
      hashToUrl.set(urlHash(u), u);
    } catch {
      // unsupported scheme — skip
    }
  }
  if (hashToUrl.size === 0) return result;

  const rows = await db
    .select()
    .from(scanCache)
    .where(
      and(
        inArray(scanCache.urlHash, Array.from(hashToUrl.keys())),
        gt(scanCache.expiresAt, new Date()),
      ),
    );

  for (const row of rows) {
    const url = hashToUrl.get(row.urlHash);
    if (!url) continue;
    result.set(url, {
      url,
      verdict: row.verdict as Verdict,
      threatType: (row.threatType as ThreatType) ?? null,
    });
  }
  return result;
}

export async function storeCacheEntries(entries: CachedVerdict[]): Promise<void> {
  if (entries.length === 0) return;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TTL_MS);
  const rows = entries.map((e) => ({
    urlHash: urlHash(e.url),
    verdict: e.verdict,
    threatType: e.threatType,
    checkedAt: now,
    expiresAt,
  }));
  await db
    .insert(scanCache)
    .values(rows)
    .onConflictDoUpdate({
      target: scanCache.urlHash,
      set: {
        verdict: scanCache.verdict,
        threatType: scanCache.threatType,
        checkedAt: now,
        expiresAt,
      },
    });
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter @gonephishin/web typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/scan-cache.ts
git commit -m "feat(web): add scan_cache read/write helpers with 6h TTL"
```

---

## Task 8: Safe Browsing Lookup API v4 client

**Files:**
- Create: `apps/web/lib/safe-browsing.ts`, `apps/web/lib/safe-browsing.test.ts`

- [ ] **Step 1: Write failing tests in `apps/web/lib/safe-browsing.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lookupSafeBrowsing } from "./safe-browsing.js";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  process.env.SAFE_BROWSING_API_KEY = "test-key";
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("lookupSafeBrowsing", () => {
  it("returns 'safe' for URLs absent from the response matches array", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );
    const result = await lookupSafeBrowsing(["https://example.com/"]);
    expect(result.get("https://example.com/")).toEqual({
      url: "https://example.com/",
      verdict: "safe",
      threatType: null,
    });
  });

  it("maps SOCIAL_ENGINEERING matches to dangerous", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          matches: [
            {
              threatType: "SOCIAL_ENGINEERING",
              threat: { url: "https://bad.example/" },
              platformType: "ANY_PLATFORM",
              threatEntryType: "URL",
            },
          ],
        }),
        { status: 200 },
      ),
    );
    const result = await lookupSafeBrowsing(["https://bad.example/"]);
    expect(result.get("https://bad.example/")).toEqual({
      url: "https://bad.example/",
      verdict: "dangerous",
      threatType: "sb_social_engineering",
    });
  });

  it("throws when the API returns 5xx so the caller can fall back", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 503 }));
    await expect(lookupSafeBrowsing(["https://example.com/"])).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
pnpm --filter @gonephishin/web test safe-browsing
```

Expected: FAIL — "Cannot find module './safe-browsing.js'".

- [ ] **Step 3: Implement `apps/web/lib/safe-browsing.ts`**

```ts
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
    result.set(url, { url, verdict: "safe" satisfies Verdict, threatType: null });
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter @gonephishin/web test safe-browsing
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/safe-browsing.ts apps/web/lib/safe-browsing.test.ts
git commit -m "feat(web): add Safe Browsing Lookup API v4 client"
```

---

## Task 9: Per-IP rate limiter

For Session 1 we only need anonymous rate limiting on `/api/scan`. We use Postgres because we already have it; this keeps state durable across Fluid Compute instance reuses without adding Redis.

**Files:**
- Create: `apps/web/lib/rate-limit.ts`, `apps/web/lib/rate-limit.test.ts`, migration for `rate_limit_buckets`

- [ ] **Step 1: Add the rate-limit table to `apps/web/lib/db/schema.ts`**

Add to the existing schema file (do not delete `scanCache`):

```ts
import { integer } from "drizzle-orm/pg-core";

export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  // Composite key. `bucketKey` is `${scope}:${identity}`, e.g. "scan:1.2.3.4".
  bucketKey: text("bucket_key").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull(),
});
```

- [ ] **Step 2: Generate and run the migration**

```bash
pnpm --filter @gonephishin/web db:generate
pnpm --filter @gonephishin/web db:migrate
```

Expected: a new migration appears in `apps/web/drizzle/`; running it adds the `rate_limit_buckets` table.

- [ ] **Step 3: Write failing tests in `apps/web/lib/rate-limit.test.ts`**

```ts
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { db } from "./db/client.js";
import { rateLimitBuckets } from "./db/schema.js";
import { takeToken } from "./rate-limit.js";

beforeAll(async () => {
  // Tests assume DATABASE_URL points at a dev/test database.
});

afterEach(async () => {
  await db.delete(rateLimitBuckets);
});

describe("takeToken", () => {
  it("allows up to `limit` requests within the window", async () => {
    for (let i = 0; i < 3; i++) {
      const ok = await takeToken("scan", "1.1.1.1", { limit: 3, windowMs: 60_000 });
      expect(ok).toBe(true);
    }
    const blocked = await takeToken("scan", "1.1.1.1", {
      limit: 3,
      windowMs: 60_000,
    });
    expect(blocked).toBe(false);
  });

  it("isolates buckets by identity", async () => {
    expect(
      await takeToken("scan", "1.1.1.1", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
    expect(
      await takeToken("scan", "2.2.2.2", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
  });

  it("isolates buckets by scope", async () => {
    expect(
      await takeToken("scan", "1.1.1.1", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
    expect(
      await takeToken("redeem", "1.1.1.1", { limit: 1, windowMs: 60_000 }),
    ).toBe(true);
  });
});
```

- [ ] **Step 4: Implement `apps/web/lib/rate-limit.ts`**

```ts
import { sql } from "drizzle-orm";
import { db } from "./db/client.js";

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

/**
 * Atomic fixed-window rate limiter backed by Postgres. Returns true if the
 * caller is allowed; false if they have exceeded `limit` within the current
 * `windowMs` window.
 *
 * We do this with a single SQL UPSERT to avoid races between concurrent
 * Fluid Compute invocations.
 */
export async function takeToken(
  scope: string,
  identity: string,
  config: RateLimitConfig,
): Promise<boolean> {
  const key = `${scope}:${identity}`;
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // Insert a new bucket at count=1 for this window, OR increment an existing
  // bucket only if its window_start is still within the window. If the bucket
  // exists but is from an older window, reset it.
  const result = await db.execute(sql`
    INSERT INTO rate_limit_buckets (bucket_key, window_start, count)
    VALUES (${key}, ${now}, 1)
    ON CONFLICT (bucket_key) DO UPDATE
      SET window_start = CASE
            WHEN rate_limit_buckets.window_start < ${windowStart} THEN ${now}
            ELSE rate_limit_buckets.window_start
          END,
          count = CASE
            WHEN rate_limit_buckets.window_start < ${windowStart} THEN 1
            ELSE rate_limit_buckets.count + 1
          END
    RETURNING count
  `);
  const row = result[0] as { count: number } | undefined;
  return (row?.count ?? Number.POSITIVE_INFINITY) <= config.limit;
}
```

- [ ] **Step 5: Run the tests**

```bash
pnpm --filter @gonephishin/web test rate-limit
```

Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib/rate-limit.ts apps/web/lib/rate-limit.test.ts apps/web/lib/db/schema.ts apps/web/drizzle
git commit -m "feat(web): add Postgres-backed per-IP rate limiter"
```

---

## Task 10: `/api/scan` route

Wires together heuristics → cache → Safe Browsing → cache write → response.

**Files:**
- Create: `apps/web/app/api/scan/route.ts`

- [ ] **Step 1: Implement `apps/web/app/api/scan/route.ts`**

```ts
import type {
  ScanRequest,
  ScanResponse,
  ScanResult,
  Verdict,
} from "@gonephishin/shared";
import { NextResponse } from "next/server";
import { checkHeuristics } from "@/lib/heuristics";
import { takeToken } from "@/lib/rate-limit";
import { lookupSafeBrowsing } from "@/lib/safe-browsing";
import { lookupCache, storeCacheEntries } from "@/lib/scan-cache";

export const runtime = "nodejs";
export const maxDuration = 10; // seconds; matches Fluid Compute defaults

const RATE_LIMIT = { limit: 600, windowMs: 60 * 60 * 1000 }; // 600 / hour / IP

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request): Promise<Response> {
  let body: ScanRequest;
  try {
    body = (await request.json()) as ScanRequest;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: "urls required" }, { status: 400 });
  }
  if (body.urls.length > 100) {
    return NextResponse.json({ error: "too many urls" }, { status: 413 });
  }

  // Rate limit by IP. Vercel sets x-forwarded-for to the client address.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await takeToken("scan", ip, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const results: ScanResult[] = [];
  const needsSb: string[] = [];

  // 1) Heuristics (catches some attacks before we touch any external state).
  const heuristicVerdicts = new Map<string, ScanResult>();
  for (const url of body.urls) {
    const h = checkHeuristics(url);
    if (h) {
      heuristicVerdicts.set(url, {
        url,
        verdict: "sketchy" satisfies Verdict,
        threatType: h.threatType,
        source: "heuristic",
      });
    }
  }

  // 2) Cache lookup for everything not already flagged by heuristics.
  const remaining = body.urls.filter((u) => !heuristicVerdicts.has(u));
  let cached = new Map<string, { url: string; verdict: Verdict; threatType: ScanResult["threatType"] }>();
  try {
    cached = await lookupCache(remaining);
  } catch {
    // Cache failure is non-fatal; we just go straight to the API.
  }

  for (const url of remaining) {
    const c = cached.get(url);
    if (c) {
      results.push({ url, verdict: c.verdict, threatType: c.threatType, source: "cache" });
    } else {
      needsSb.push(url);
    }
  }

  // 3) Safe Browsing for the rest. On failure, mark them unknown/fallback.
  if (needsSb.length > 0) {
    try {
      const sb = await lookupSafeBrowsing(needsSb);
      const toStore: { url: string; verdict: Verdict; threatType: ScanResult["threatType"] }[] = [];
      for (const url of needsSb) {
        const v = sb.get(url) ?? { url, verdict: "safe" as Verdict, threatType: null };
        results.push({ url, verdict: v.verdict, threatType: v.threatType, source: "fresh" });
        toStore.push(v);
      }
      // Best-effort write; do not block the response on failure.
      storeCacheEntries(toStore).catch((err) => console.error("scan-cache store failed", err));
    } catch (err) {
      console.error("safe browsing lookup failed", err);
      for (const url of needsSb) {
        results.push({ url, verdict: "unknown", threatType: null, source: "fallback" });
      }
    }
  }

  // Re-add the heuristic verdicts at the end so the response covers all input.
  for (const v of heuristicVerdicts.values()) results.push(v);

  const response: ScanResponse = { results, paired: false };
  return NextResponse.json(response);
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter @gonephishin/web typecheck
```

Expected: no errors.

- [ ] **Step 3: Smoke test the endpoint**

```bash
pnpm --filter @gonephishin/web dev
```

In another terminal:

```bash
curl -s -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://example.com/","https://paypa1.com/"]}' | jq .
```

Expected: a JSON body with `results` containing two entries — `https://example.com/` (verdict `safe` or `unknown` depending on whether you set SAFE_BROWSING_API_KEY) and `https://paypa1.com/` (verdict `sketchy`, threatType `heuristic_typosquat`, source `heuristic`).

If you do not yet have SAFE_BROWSING_API_KEY set in `.env.local`, the safe URL comes back with verdict `unknown` and source `fallback` — that is the correct fallback behavior.

- [ ] **Step 4: Test against Google's known-malware test URL**

If you have `SAFE_BROWSING_API_KEY` set:

```bash
curl -s -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"urls":["http://malware.testing.google.test/testing/malware/"]}' | jq .
```

Expected: verdict `dangerous`, threatType `sb_malware`, source `fresh`. Run it again — second time the source is `cache`.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/api/scan
git commit -m "feat(web): wire /api/scan with heuristics, cache, and Safe Browsing"
```

---

## Task 11: Extension scaffold (Vite + CRXJS, Manifest V3)

**Files:**
- Create: `apps/extension/package.json`, `apps/extension/vite.config.ts`, `apps/extension/manifest.config.ts`, `apps/extension/tsconfig.json`, `apps/extension/.env.example`, `apps/extension/src/shared/env.ts`

- [ ] **Step 1: Create `apps/extension/package.json`**

```json
{
  "name": "@gonephishin/extension",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@gonephishin/shared": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@crxjs/vite-plugin": "^2.0.0-beta.28",
    "@types/chrome": "^0.0.275",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "happy-dom": "^15.7.4",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `apps/extension/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "noEmit": true,
    "types": ["chrome", "vite/client"],
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "manifest.config.ts", "vite.config.ts"]
}
```

- [ ] **Step 3: Create `apps/extension/.env.example`**

```
# Base URL the extension uses for all API calls.
# Local dev: http://localhost:3000
# Vercel preview / production: https://gonephishin.com (or the preview URL)
VITE_API_BASE_URL=http://localhost:3000
```

- [ ] **Step 4: Create `apps/extension/src/shared/env.ts`**

```ts
const url = import.meta.env.VITE_API_BASE_URL;
if (!url) throw new Error("VITE_API_BASE_URL is not set at build time");

export const API_BASE_URL: string = url;
```

- [ ] **Step 5: Create `apps/extension/manifest.config.ts`**

```ts
import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Gone Phishin'",
  version: "0.1.0",
  description:
    "Warns you about phishing links in Gmail and Outlook before you click them.",
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Gone Phishin'",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  permissions: ["storage", "alarms"],
  host_permissions: [
    "https://mail.google.com/*",
    "https://outlook.live.com/*",
    "https://outlook.office.com/*",
    "https://outlook.office365.com/*",
    // Allow the extension to call the API base regardless of dev/prod.
    "http://localhost:3000/*",
    "https://*.vercel.app/*",
    "https://gonephishin.com/*",
  ],
  content_scripts: [
    {
      matches: [
        "https://mail.google.com/*",
        "https://outlook.live.com/*",
        "https://outlook.office.com/*",
        "https://outlook.office365.com/*",
      ],
      js: ["src/content/index.ts"],
      css: ["src/content/content.css"],
      run_at: "document_idle",
      all_frames: false,
    },
  ],
  externally_connectable: {
    matches: ["https://gonephishin.com/*", "https://*.vercel.app/*", "http://localhost:3000/*"],
  },
});
```

- [ ] **Step 6: Create `apps/extension/vite.config.ts`**

```ts
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import manifest from "./manifest.config.js";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 7: Verify it builds**

```bash
pnpm install
pnpm --filter @gonephishin/extension build
```

Expected: Vite reports success. The `apps/extension/dist` folder exists with a `manifest.json` inside. (Content scripts and popup will be empty stubs until later tasks fill them in.)

- [ ] **Step 8: Commit**

```bash
git add apps/extension pnpm-lock.yaml
git commit -m "feat(extension): scaffold Manifest V3 build with CRXJS and Vite"
```

---

## Task 12: Cross-context message types

**Files:**
- Create: `apps/extension/src/shared/messages.ts`

- [ ] **Step 1: Implement `apps/extension/src/shared/messages.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";

/**
 * Message types exchanged between content scripts, the service worker, and
 * the popup. Discriminated by `type` so chrome.runtime listeners can switch
 * cleanly.
 */
export type ExtensionMessage =
  | { type: "scan-urls"; urls: string[] }
  | { type: "scan-result"; results: ScanResult[] }
  | { type: "warning-acknowledged"; url: string; outcome: "dismissed" | "ignored_warning" }
  | { type: "ping" };

export type ScanUrlsRequest = Extract<ExtensionMessage, { type: "scan-urls" }>;
export type ScanUrlsResponse = { results: ScanResult[] };
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/shared/messages.ts
git commit -m "feat(extension): define cross-context message types"
```

---

## Task 13: Service worker — verdict cache

**Files:**
- Create: `apps/extension/src/background/cache.ts`, `apps/extension/src/background/cache.test.ts`

- [ ] **Step 1: Write failing tests in `apps/extension/src/background/cache.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCachedVerdict, putCachedVerdict } from "./cache.js";

const storage: Record<string, unknown> = {};

beforeEach(() => {
  for (const k of Object.keys(storage)) delete storage[k];
  // Minimal chrome.storage.local stub.
  (globalThis as unknown as { chrome: typeof chrome }).chrome = {
    storage: {
      local: {
        async get(keys: string | string[]) {
          const arr = Array.isArray(keys) ? keys : [keys];
          const out: Record<string, unknown> = {};
          for (const k of arr) if (k in storage) out[k] = storage[k];
          return out;
        },
        async set(items: Record<string, unknown>) {
          Object.assign(storage, items);
        },
      },
    },
  } as unknown as typeof chrome;
});

afterEach(() => vi.useRealTimers());

describe("verdict cache", () => {
  it("returns null for an empty cache", async () => {
    expect(await getCachedVerdict("https://x.com/")).toBeNull();
  });

  it("returns a stored verdict within TTL", async () => {
    await putCachedVerdict({
      url: "https://x.com/",
      verdict: "safe",
      threatType: null,
      source: "cache",
    });
    expect((await getCachedVerdict("https://x.com/"))?.verdict).toBe("safe");
  });

  it("expires entries past 24h", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-28T00:00:00Z"));
    await putCachedVerdict({
      url: "https://x.com/",
      verdict: "safe",
      threatType: null,
      source: "cache",
    });
    vi.setSystemTime(new Date("2026-04-29T00:00:01Z"));
    expect(await getCachedVerdict("https://x.com/")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm --filter @gonephishin/extension test cache
```

Expected: FAIL — "Cannot find module './cache.js'".

- [ ] **Step 3: Implement `apps/extension/src/background/cache.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";

const TTL_MS = 24 * 60 * 60 * 1000; // 24h per spec §5.5
const PREFIX = "verdict:";

interface Entry {
  result: ScanResult;
  storedAt: number;
}

function key(url: string): string {
  return PREFIX + url;
}

export async function getCachedVerdict(url: string): Promise<ScanResult | null> {
  const k = key(url);
  const obj = (await chrome.storage.local.get(k)) as Record<string, Entry | undefined>;
  const entry = obj[k];
  if (!entry) return null;
  if (Date.now() - entry.storedAt > TTL_MS) {
    chrome.storage.local.remove(k);
    return null;
  }
  return entry.result;
}

export async function putCachedVerdict(result: ScanResult): Promise<void> {
  const entry: Entry = { result, storedAt: Date.now() };
  await chrome.storage.local.set({ [key(result.url)]: entry });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter @gonephishin/extension test cache
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/extension/src/background/cache.ts apps/extension/src/background/cache.test.ts
git commit -m "feat(extension): add 24h verdict cache backed by chrome.storage.local"
```

---

## Task 14: Service worker — `/api/scan` client

**Files:**
- Create: `apps/extension/src/background/api-client.ts`

- [ ] **Step 1: Implement `apps/extension/src/background/api-client.ts`**

```ts
import type { ScanRequest, ScanResponse, ScanResult } from "@gonephishin/shared";
import { API_BASE_URL } from "../shared/env.js";

const TIMEOUT_MS = 3000;

/**
 * Calls /api/scan with a hard 3s timeout. Returns 'unknown' / source 'fallback'
 * for every URL on any failure so callers can render gracefully.
 */
export async function scanUrlsViaApi(urls: string[]): Promise<ScanResult[]> {
  if (urls.length === 0) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: ScanRequest = { urls };
    const res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`scan returned ${res.status}`);
    const data = (await res.json()) as ScanResponse;
    return data.results;
  } catch (err) {
    console.warn("[gonephishin] scan failed, falling back to unknown:", err);
    return urls.map((url) => ({
      url,
      verdict: "unknown",
      threatType: null,
      source: "fallback",
    }));
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter @gonephishin/extension typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/extension/src/background/api-client.ts
git commit -m "feat(extension): add /api/scan client with 3s timeout"
```

---

## Task 15: Service worker — main entry

**Files:**
- Create: `apps/extension/src/background/service-worker.ts`

- [ ] **Step 1: Implement `apps/extension/src/background/service-worker.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";
import type { ExtensionMessage } from "../shared/messages.js";
import { scanUrlsViaApi } from "./api-client.js";
import { getCachedVerdict, putCachedVerdict } from "./cache.js";

console.log("[gonephishin] service worker booted");

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === "scan-urls") {
    void handleScanUrls(message.urls).then((results) =>
      sendResponse({ results } satisfies { results: ScanResult[] }),
    );
    return true; // keep channel open for async sendResponse
  }
  if (message.type === "ping") {
    sendResponse({ ok: true });
    return false;
  }
  return false;
});

async function handleScanUrls(urls: string[]): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const need: string[] = [];

  for (const url of urls) {
    const cached = await getCachedVerdict(url);
    if (cached) {
      results.push(cached);
    } else {
      need.push(url);
    }
  }

  if (need.length > 0) {
    const fresh = await scanUrlsViaApi(need);
    for (const r of fresh) {
      // Don't cache fallback verdicts — we want to retry next time.
      if (r.source !== "fallback") {
        await putCachedVerdict(r);
      }
      results.push(r);
    }
  }
  return results;
}
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter @gonephishin/extension typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/extension/src/background/service-worker.ts
git commit -m "feat(extension): add service worker entry that bridges cache and API"
```

---

## Task 16: Content — URL skip rules

**Files:**
- Create: `apps/extension/src/content/shared/url-skip.ts`, `apps/extension/src/content/shared/url-skip.test.ts`

- [ ] **Step 1: Write failing tests in `apps/extension/src/content/shared/url-skip.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { shouldSkipUrl } from "./url-skip.js";

describe("shouldSkipUrl", () => {
  it.each([
    "mailto:user@example.com",
    "tel:+15551234",
    "javascript:void(0)",
    "data:text/html,...",
    "chrome-extension://abc/page",
    "#section",
    "",
  ])("skips non-http schemes and anchors: %s", (url) => {
    expect(shouldSkipUrl(url)).toBe(true);
  });

  it("does not skip http and https URLs", () => {
    expect(shouldSkipUrl("https://example.com/foo")).toBe(false);
    expect(shouldSkipUrl("http://example.com/foo")).toBe(false);
  });

  it("skips relative URLs (no scheme)", () => {
    expect(shouldSkipUrl("/some/path")).toBe(true);
    expect(shouldSkipUrl("./local")).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
pnpm --filter @gonephishin/extension test url-skip
```

Expected: FAIL.

- [ ] **Step 3: Implement `apps/extension/src/content/shared/url-skip.ts`**

```ts
const HTTP_SCHEME = /^https?:\/\//i;

export function shouldSkipUrl(url: string): boolean {
  if (!url) return true;
  return !HTTP_SCHEME.test(url);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm --filter @gonephishin/extension test url-skip
```

Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/extension/src/content/shared/url-skip.ts apps/extension/src/content/shared/url-skip.test.ts
git commit -m "feat(extension): add URL skip rules with tests"
```

---

## Task 17: Content — SiteAdapter interface

**Files:**
- Create: `apps/extension/src/content/shared/site-adapter.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/shared/site-adapter.ts`**

```ts
export interface SiteAdapter {
  /** Identifier reported in danger-event logs. */
  id: "gmail" | "outlook";

  /** CSS selector identifying the page region(s) that contain message bodies. */
  rootSelector: string;

  /** Decide whether to scan a particular link. False = skip silently. */
  shouldScanLink(linkEl: HTMLAnchorElement): boolean;

  /**
   * Resolve a possibly-wrapped href to the real destination. Common cases:
   *   - google.com/url?q=...
   *   - l.facebook.com/l.php?u=...
   *   - safelinks.protection.outlook.com/?url=...
   * Return the original href if no unwrapping is needed.
   */
  unwrapTrackingUrl(href: string): string;

  /**
   * Set up a MutationObserver scoped to the site's SPA model. Calls
   * `onChange` whenever new scannable content appears. Returns a disposer.
   */
  observeMutations(onChange: () => void): () => void;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/content/shared/site-adapter.ts
git commit -m "feat(extension): define SiteAdapter interface"
```

---

## Task 18: Content — link scanner

**Files:**
- Create: `apps/extension/src/content/shared/link-scanner.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/shared/link-scanner.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";
import type { SiteAdapter } from "./site-adapter.js";
import { shouldSkipUrl } from "./url-skip.js";

const BATCH_SIZE = 50;
const FLUSH_DEBOUNCE_MS = 200;

type OnVerdicts = (verdicts: ScanResult[], anchorsByUrl: Map<string, HTMLAnchorElement[]>) => void;

export function startLinkScanner(adapter: SiteAdapter, onVerdicts: OnVerdicts): () => void {
  const seen = new WeakSet<HTMLAnchorElement>();
  let pendingByUrl: Map<string, HTMLAnchorElement[]> = new Map();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const collect = () => {
    for (const root of document.querySelectorAll(adapter.rootSelector)) {
      const anchors = root.querySelectorAll<HTMLAnchorElement>("a[href]");
      for (const a of anchors) {
        if (seen.has(a)) continue;
        seen.add(a);
        if (!adapter.shouldScanLink(a)) continue;
        const target = adapter.unwrapTrackingUrl(a.href);
        if (shouldSkipUrl(target)) continue;
        // Tag the anchor so click-guard knows the canonical URL it represents.
        a.dataset.gpUrl = target;
        const list = pendingByUrl.get(target);
        if (list) list.push(a);
        else pendingByUrl.set(target, [a]);
      }
    }
    scheduleFlush();
  };

  const scheduleFlush = () => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      void flush();
    }, FLUSH_DEBOUNCE_MS);
  };

  const flush = async () => {
    if (pendingByUrl.size === 0) return;
    const batch = pendingByUrl;
    pendingByUrl = new Map();
    const urls = Array.from(batch.keys());
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const slice = urls.slice(i, i + BATCH_SIZE);
      const sliceMap = new Map<string, HTMLAnchorElement[]>();
      for (const u of slice) sliceMap.set(u, batch.get(u)!);
      const response = (await chrome.runtime.sendMessage({
        type: "scan-urls",
        urls: slice,
      })) as { results: ScanResult[] } | undefined;
      if (response) onVerdicts(response.results, sliceMap);
    }
  };

  const dispose = adapter.observeMutations(collect);
  collect(); // first pass on the page as it stands
  return () => {
    if (timer) clearTimeout(timer);
    dispose();
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/content/shared/link-scanner.ts
git commit -m "feat(extension): add batched link scanner with mutation observer"
```

---

## Task 19: Content — link painter

**Files:**
- Create: `apps/extension/src/content/shared/link-painter.ts`, `apps/extension/src/content/content.css`

- [ ] **Step 1: Implement `apps/extension/src/content/content.css`**

```css
/* Every state uses a colored 2px bottom border so links remain readable.
   Gmail/Outlook have heavy in-line styling — we use !important so our colors
   beat theirs. The badge is appended via ::after with a fixed width so it
   doesn't reflow text. */
.gp-link[data-gp-state] {
  border-bottom: 2px solid currentColor !important;
  text-decoration: none !important;
}
.gp-link[data-gp-state]::after {
  display: inline-block;
  font-size: 0.85em;
  margin-left: 0.25em;
  vertical-align: baseline;
  font-family: system-ui, sans-serif;
}
.gp-link[data-gp-state="safe"] { color: #15803d !important; } /* green-700 */
.gp-link[data-gp-state="safe"]::after { content: "✓"; }
.gp-link[data-gp-state="unknown"] { color: #6b7280 !important; } /* gray-500 */
.gp-link[data-gp-state="unknown"]::after { content: "?"; }
.gp-link[data-gp-state="sketchy"] { color: #b45309 !important; } /* amber-700 */
.gp-link[data-gp-state="sketchy"]::after { content: "⚠"; }
.gp-link[data-gp-state="dangerous"] { color: #b91c1c !important; } /* red-700 */
.gp-link[data-gp-state="dangerous"]::after { content: "🛑"; }
```

- [ ] **Step 2: Implement `apps/extension/src/content/shared/link-painter.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";

export function paintAnchors(
  results: ScanResult[],
  anchorsByUrl: Map<string, HTMLAnchorElement[]>,
): void {
  for (const r of results) {
    const anchors = anchorsByUrl.get(r.url) ?? [];
    for (const a of anchors) {
      a.classList.add("gp-link");
      a.dataset.gpState = r.verdict;
      if (r.threatType) a.dataset.gpThreat = r.threatType;
      a.title = describe(r);
    }
  }
}

function describe(r: ScanResult): string {
  switch (r.verdict) {
    case "safe":
      return "Gone Phishin' checked this link — it looks safe.";
    case "unknown":
      return "Gone Phishin' couldn't check this link right now. Be careful.";
    case "sketchy":
      return `Gone Phishin' thinks this link looks suspicious (${r.threatType ?? "unknown"}).`;
    case "dangerous":
      return `Gone Phishin' has flagged this link as dangerous (${r.threatType ?? "unknown"}). Do not click.`;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/extension/src/content/content.css apps/extension/src/content/shared/link-painter.ts
git commit -m "feat(extension): add link painter and CSS for the four states"
```

---

## Task 20: Content — warning modal

**Files:**
- Create: `apps/extension/src/content/shared/warning-modal.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/shared/warning-modal.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";

/** Result of the user's choice in the modal. */
export type ModalOutcome = "dismissed" | "ignored_warning";

/**
 * Inject a shadow-DOM-isolated <dialog> element and resolve when the user
 * picks an action. Re-uses one host element per page.
 */
let host: HTMLElement | null = null;

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
  frag.querySelector('[data-action="continue"]')!.addEventListener("click", () => {
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
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/content/shared/warning-modal.ts
git commit -m "feat(extension): add shadow-DOM warning modal with go-back and continue"
```

---

## Task 21: Content — click guard

**Files:**
- Create: `apps/extension/src/content/shared/click-guard.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/shared/click-guard.ts`**

```ts
import type { ScanResult } from "@gonephishin/shared";
import { showWarningModal, type ModalOutcome } from "./warning-modal.js";

const verdictByUrl = new Map<string, ScanResult>();
const urlBypassed = new Set<string>();

/** Update the guard's index of verdicts. Called by the scanner. */
export function rememberVerdict(result: ScanResult): void {
  verdictByUrl.set(result.url, result);
}

/**
 * Install a single capture-phase pointerdown listener. We attach to
 * pointerdown (not click) so we run before the page's own handlers, and we
 * use the capture phase so we can stop propagation cleanly.
 */
export function installClickGuard(onOutcome: (url: string, outcome: ModalOutcome) => void): void {
  document.addEventListener(
    "pointerdown",
    async (event) => {
      const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-gp-url]");
      if (!anchor) return;
      const url = anchor.dataset.gpUrl!;
      if (urlBypassed.has(url)) return;
      const verdict = verdictByUrl.get(url);
      if (!verdict) return;
      if (verdict.verdict !== "sketchy" && verdict.verdict !== "dangerous") return;

      // Suppress middle-click / cmd-click navigation while we ask.
      event.preventDefault();
      event.stopImmediatePropagation();

      const outcome = await showWarningModal(verdict);
      onOutcome(url, outcome);
      if (outcome === "ignored_warning") {
        urlBypassed.add(url);
        // Re-issue a synthesized click on the anchor; the URL is now bypassed
        // so the guard will let it through.
        anchor.click();
      }
    },
    { capture: true },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/content/shared/click-guard.ts
git commit -m "feat(extension): add pointerdown-capture click guard"
```

---

## Task 22: Content — Gmail site adapter

**Files:**
- Create: `apps/extension/src/content/sites/gmail.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/sites/gmail.ts`**

```ts
import type { SiteAdapter } from "../shared/site-adapter.js";

/**
 * Gmail's open conversation pane uses role="main" with message bodies inside
 * elements that have class "ii gt" (the body) and "a3s" (rendered content).
 * The list view also has links in the snippet — we scan those too.
 */
export const gmail: SiteAdapter = {
  id: "gmail",
  rootSelector: 'div[role="main"]',
  shouldScanLink(linkEl) {
    // Skip Gmail's own UI affordances.
    if (linkEl.closest('[role="navigation"], [role="banner"], [role="toolbar"], header')) return false;
    if (!linkEl.href) return false;
    return true;
  },
  unwrapTrackingUrl(href) {
    try {
      const u = new URL(href);
      // google.com/url?q=<real>&...
      if (u.hostname.endsWith("google.com") && u.pathname === "/url") {
        const real = u.searchParams.get("q");
        if (real) return real;
      }
    } catch {
      /* fall through */
    }
    return href;
  },
  observeMutations(onChange) {
    const target = document.body;
    const observer = new MutationObserver(() => onChange());
    observer.observe(target, { childList: true, subtree: true });
    return () => observer.disconnect();
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/content/sites/gmail.ts
git commit -m "feat(extension): add Gmail site adapter with tracking URL unwrap"
```

---

## Task 23: Content — Outlook site adapter

**Files:**
- Create: `apps/extension/src/content/sites/outlook.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/sites/outlook.ts`**

```ts
import type { SiteAdapter } from "../shared/site-adapter.js";

/**
 * Outlook (web) wraps every link with safelinks.protection.outlook.com.
 * The real URL is in the `url` query parameter.
 */
export const outlook: SiteAdapter = {
  id: "outlook",
  rootSelector: '[role="main"]',
  shouldScanLink(linkEl) {
    if (linkEl.closest('[role="navigation"], [role="banner"], [role="toolbar"], header')) return false;
    if (!linkEl.href) return false;
    return true;
  },
  unwrapTrackingUrl(href) {
    try {
      const u = new URL(href);
      if (
        u.hostname === "safelinks.protection.outlook.com" ||
        u.hostname.endsWith(".safelinks.protection.outlook.com")
      ) {
        const real = u.searchParams.get("url");
        if (real) return decodeURIComponent(real);
      }
    } catch {
      /* fall through */
    }
    return href;
  },
  observeMutations(onChange) {
    const observer = new MutationObserver(() => onChange());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/extension/src/content/sites/outlook.ts
git commit -m "feat(extension): add Outlook site adapter with safelinks unwrap"
```

---

## Task 24: Content — main entry that wires everything

**Files:**
- Create: `apps/extension/src/content/index.ts`

- [ ] **Step 1: Implement `apps/extension/src/content/index.ts`**

```ts
import type { SiteAdapter } from "./shared/site-adapter.js";
import { installClickGuard, rememberVerdict } from "./shared/click-guard.js";
import { paintAnchors } from "./shared/link-painter.js";
import { startLinkScanner } from "./shared/link-scanner.js";
import { gmail } from "./sites/gmail.js";
import { outlook } from "./sites/outlook.js";

const adapter = pickAdapter();
if (adapter) start(adapter);

function pickAdapter(): SiteAdapter | null {
  const host = location.hostname;
  if (host === "mail.google.com") return gmail;
  if (
    host === "outlook.live.com" ||
    host === "outlook.office.com" ||
    host === "outlook.office365.com"
  )
    return outlook;
  return null;
}

function start(a: SiteAdapter) {
  console.log("[gonephishin] active on", a.id);
  installClickGuard((url, outcome) => {
    chrome.runtime
      .sendMessage({ type: "warning-acknowledged", url, outcome })
      .catch(() => {
        /* listener absent is fine in v0.1a */
      });
  });
  startLinkScanner(a, (results, anchorsByUrl) => {
    for (const r of results) rememberVerdict(r);
    paintAnchors(results, anchorsByUrl);
  });
}
```

- [ ] **Step 2: Build the extension**

```bash
pnpm --filter @gonephishin/extension build
```

Expected: build succeeds; `apps/extension/dist` contains `manifest.json`, content script bundles, and CSS.

- [ ] **Step 3: Commit**

```bash
git add apps/extension/src/content/index.ts
git commit -m "feat(extension): wire content script entry to adapter, scanner, painter, click guard"
```

---

## Task 25: Popup UI

The Session 1 popup shows a "Choose Mode" screen with both options visibly disabled with a "Coming in the next update" note. The Status screen shows that the extension is running in anonymous mode. Session 2 will replace these stubs with real handlers.

**Files:**
- Create: `apps/extension/src/popup/index.html`, `apps/extension/src/popup/main.tsx`, `apps/extension/src/popup/App.tsx`, `apps/extension/src/popup/ChooseModeScreen.tsx`, `apps/extension/src/popup/StatusScreen.tsx`, `apps/extension/src/popup/popup.css`

- [ ] **Step 1: Create `apps/extension/src/popup/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Gone Phishin'</title>
    <link rel="stylesheet" href="./popup.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `apps/extension/src/popup/popup.css`**

```css
:root {
  font-family: system-ui, sans-serif;
  font-size: 15px;
  color: #111;
}
body {
  margin: 0;
  width: 320px;
  padding: 16px;
  background: white;
}
h1 {
  font-size: 18px;
  margin: 0 0 4px;
}
p {
  margin: 0 0 12px;
  color: #4b5563;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.button {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}
.button:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}
.note {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}
.status {
  font-size: 14px;
  background: #ecfdf5;
  color: #065f46;
  padding: 10px;
  border-radius: 8px;
}
```

- [ ] **Step 3: Create `apps/extension/src/popup/StatusScreen.tsx`**

```tsx
export function StatusScreen() {
  return (
    <>
      <h1>You're protected</h1>
      <p>Gone Phishin' is checking links in Gmail and Outlook.</p>
      <div className="status">
        Anonymous mode active. Sign-in and family pairing arrive in the next update.
      </div>
    </>
  );
}
```

- [ ] **Step 4: Create `apps/extension/src/popup/ChooseModeScreen.tsx`**

```tsx
export function ChooseModeScreen() {
  return (
    <>
      <h1>How will you use Gone Phishin'?</h1>
      <p>Pick one. Both options arrive in the next update.</p>
      <div className="buttons">
        <button className="button" disabled>
          I have a code from family
        </button>
        <button className="button" disabled>
          This is for myself — sign in
        </button>
      </div>
      <p className="note">
        For now, the extension protects you in anonymous mode without any account.
      </p>
    </>
  );
}
```

- [ ] **Step 5: Create `apps/extension/src/popup/App.tsx`**

```tsx
import { ChooseModeScreen } from "./ChooseModeScreen.js";
import { StatusScreen } from "./StatusScreen.js";

export function App() {
  return (
    <>
      <StatusScreen />
      <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
      <ChooseModeScreen />
    </>
  );
}
```

- [ ] **Step 6: Create `apps/extension/src/popup/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 7: Build and confirm the popup HTML lands in dist**

```bash
pnpm --filter @gonephishin/extension build
ls apps/extension/dist/src/popup
```

Expected: `index.html` and a hashed `main-*.js` bundle exist. Build is green.

- [ ] **Step 8: Commit**

```bash
git add apps/extension/src/popup
git commit -m "feat(extension): add popup with Choose Mode and Status placeholder screens"
```

---

## Task 26: End-to-end manual smoke test

This is a manual checklist. Run it before declaring Session 1 done.

- [ ] **Step 1: Start the web app locally**

```bash
pnpm --filter @gonephishin/web dev
```

Confirm `http://localhost:3000` loads the placeholder page.

- [ ] **Step 2: Build and load the extension**

```bash
pnpm --filter @gonephishin/extension build
```

Then in Chrome:

1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and choose `apps/extension/dist`.
4. The extension should load without errors. Inspect the service worker via the "service worker" link on the extension card — you should see `[gonephishin] service worker booted` in its console.

- [ ] **Step 3: Test in Gmail**

1. Navigate to `https://mail.google.com`.
2. Open an email containing a link.
3. Wait ~1 second; the link should gain a colored underline and a badge to the right of it. Most legitimate links land at green ✓ or gray ?.
4. Open the page console. Confirm there are no errors thrown by Gone Phishin'.

If you do not have a real phishing email handy, the test URL `http://malware.testing.google.test/testing/malware/` should be marked dangerous; you can paste it into a draft email and view it. Alternatively, paste `https://paypa1.com/` — the heuristic should mark it sketchy.

- [ ] **Step 4: Test the click guard**

Click the dangerous (or sketchy) link. The full-screen warning modal should appear with the URL displayed, and "Go Back" / "Continue Anyway" buttons. "Go Back" closes the modal and prevents navigation. "Continue Anyway" closes the modal and the link opens normally.

- [ ] **Step 5: Test in Outlook**

1. Navigate to `https://outlook.live.com` and sign in.
2. Open any message with links.
3. Confirm Outlook's safelinks-wrapped URLs still render colored underlines reflecting the underlying destination, not the safelinks proxy.

- [ ] **Step 6: Test cache behavior**

Open a Gmail message twice. On the second open, watch the Network tab inside the service worker console — it should NOT issue a `/api/scan` request for any URL it already saw within the past 24h. (Use `chrome://extensions` → "service worker" → "Network" tab.)

- [ ] **Step 7: Test rate-limit and fallback**

Stop the web app dev server. Reload Gmail. Links should be marked Unknown (gray ?). The extension must not crash. Restart the web app and reload Gmail; verdicts should resolve to Safe / Sketchy / Dangerous again.

- [ ] **Step 8: Open the popup**

Click the extension icon. Confirm the popup renders with "You're protected" status and the disabled choose-mode buttons.

- [ ] **Step 9: Commit a tag for the v0.1a milestone**

```bash
git tag -a v0.1a -m "v0.1a — anonymous-mode extension working end-to-end on Gmail and Outlook"
```

---

## Task 27: Deploy to Vercel preview and re-test against the deployed API

**Files:**
- Modify: `apps/extension/.env.local` (created at runtime, not committed)

- [ ] **Step 1: Push to a new GitHub repo (optional, recommended)**

If this monorepo is not yet on GitHub:

```bash
gh repo create gonephishin --private --source=. --remote=origin --push
```

- [ ] **Step 2: Set the Safe Browsing key on Vercel**

```bash
cd apps/web
vercel env add SAFE_BROWSING_API_KEY preview
# paste the key when prompted
vercel env add SAFE_BROWSING_API_KEY production
# paste the key when prompted
cd ../..
```

- [ ] **Step 3: Trigger a Vercel preview deploy**

```bash
cd apps/web
vercel --yes
cd ../..
```

Note the preview URL printed at the end (e.g. `https://gonephishin-abc123.vercel.app`).

- [ ] **Step 4: Smoke-test the deployed `/api/scan`**

```bash
curl -s -X POST https://gonephishin-<hash>.vercel.app/api/scan \
  -H "Content-Type: application/json" \
  -d '{"urls":["http://malware.testing.google.test/testing/malware/"]}' | jq .
```

Expected: verdict `dangerous`, threatType `sb_malware`.

- [ ] **Step 5: Point the extension at the preview URL and rebuild**

Edit `apps/extension/.env.local` (do not commit):

```
VITE_API_BASE_URL=https://gonephishin-<hash>.vercel.app
```

Rebuild:

```bash
pnpm --filter @gonephishin/extension build
```

In `chrome://extensions`, click the refresh icon on the Gone Phishin' card. Reload Gmail; verdicts should still resolve correctly. Check the service worker network tab to confirm requests now go to the preview domain.

- [ ] **Step 6: Commit any config changes**

```bash
# .env.local is already gitignored. If you tweaked anything else, commit it now.
git status
```

If nothing needs committing, you're done with Session 1.

---

## Session 1 Done — what's working

- A signed-in-anywhere user can install the extension and use Gmail / Outlook with phishing-link warnings.
- `/api/scan` is live on Vercel with rate limiting, heuristics, Safe Browsing, and a 6-hour cache.
- The full code path is tested: pure-function units have vitest tests; integration paths have manual smoke-test checklists.
- The popup shows the eventual mode-choice UI with disabled buttons — Session 2 fills them in.

The next plan (Session 2 / v0.1b) will add Clerk sign-in, the marketing page, the dashboard, the pairing endpoints, the `/extension/activate` handoff page, and event logging. That plan will be written tomorrow when the user supplies marketing-page components.
