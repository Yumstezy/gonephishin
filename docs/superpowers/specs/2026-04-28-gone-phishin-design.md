# Gone Phishin' — Design Spec

**Date:** 2026-04-28
**Status:** Draft — design approved in conversation, awaiting user review of this written document
**Domain:** `gonephishin.com` (placeholder, not yet registered)

## 1. Purpose

Gone Phishin' protects older and less-tech-savvy users from phishing links in their everyday browsing. It is named in reference to the 1997 film *Gone Fishin'*.

The product has two surfaces:

1. A **Chrome extension** that scans links on supported webmail and social-DM sites, marks them with a clear safety status, and intercepts clicks on dangerous ones with a plain-English warning.
2. A **single-page web app** (`gonephishin.com`) where caregivers (typically adult children) can install the extension, sign in, and pair with their parent's browser to see what phishing attempts their parent is encountering.

The target user of the extension is a senior who does not want — and will not maintain — an account, password, or technical configuration. The target user of the dashboard is a worried adult child who wants visibility without invading their parent's privacy.

## 2. Non-Goals

- We do **not** scan email content (subjects, senders, or message bodies). URLs only.
- We do **not** build our own threat intelligence — we rely on Google Safe Browsing plus a small set of local heuristics.
- We do **not** support seniors creating their own accounts. Seniors are represented by a `circle` owned by their caregiver.
- We do **not** support real-time chat, password management, or recovery flows for seniors.
- We do **not** request `<all_urls>` host permissions. The extension only operates on the explicit list of supported sites.

## 3. Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│  Chrome Extension   │ ──API──▶│   Vercel Web App     │ ──API──▶│  Google Safe        │
│  (the senior's      │         │   (gonephishin.com)  │         │  Browsing API       │
│   browser)          │ ◀───────│   - Landing page     │         └─────────────────────┘
│  - Content scripts  │         │   - Caregiver login  │
│  - Service worker   │         │   - API routes       │ ──reads/writes──▶  ┌──────────┐
│  - Popup (pairing)  │         │   - Dashboard        │                    │  Neon    │
└─────────────────────┘         └──────────────────────┘                    │ Postgres │
                                            │                               └──────────┘
                                            │ auth via
                                            ▼
                                       ┌──────────┐
                                       │  Clerk   │
                                       └──────────┘
```

**Three components:** the Chrome extension, the Next.js web app (which contains both the marketing landing page and the caregiver dashboard), and the Postgres database. External dependencies are Google Safe Browsing (URL verdicts), Clerk (caregiver auth), and Resend (transactional email — used in v0.2 for the email-invite pairing flow).

**Key flow when a senior opens an email:**

1. Content script finds `<a>` tags in the page region defined for that site.
2. URLs are normalized (tracking redirects unwrapped) and sent in batches to the extension service worker.
3. Service worker checks the local 24h cache → for unknowns, calls `gonephishin.com/api/scan`.
4. Backend runs heuristic pre-check, then forwards unknowns to the Google Safe Browsing **Lookup API v4**, caches the result for 6h, and returns verdicts.
5. Content script paints each link with a subtle underline + a small icon badge per status.
6. If the senior clicks a Sketchy or Dangerous link, the click is intercepted on `pointerdown` (capture phase) and a full-screen warning modal is shown.
7. If the extension is paired with a caregiver's circle, the danger event (URL, threat type, action taken) is logged to the backend. Email content is never transmitted.

## 4. Tech Stack

**Web app:**

- Next.js 16 App Router with TypeScript, hosted on Vercel (Fluid Compute)
- Tailwind CSS + shadcn/ui for styling and components
- Clerk for caregiver authentication (Vercel Marketplace)
- Neon Postgres for the database (Vercel Marketplace), accessed via Drizzle ORM
- Resend for transactional email (v0.2+)

**Chrome extension:**

- Manifest V3
- TypeScript built with Vite + CRXJS
- React for the popup UI
- Vanilla TypeScript for content scripts (no React in content scripts to keep injection footprint small)

**Repo:**

- Turborepo monorepo
- Shared packages for cross-project TypeScript types and (later) shadcn/ui components

```
gonephishin/
├── apps/
│   ├── web/              # Next.js 16 — landing + dashboard + API routes
│   └── extension/        # Manifest V3 Chrome extension
├── packages/
│   ├── shared/           # Shared TS types (API contracts)
│   └── ui/               # Shared shadcn/ui components
└── turbo.json
```

## 5. Chrome Extension Design

### 5.1 File layout

```
apps/extension/
├── manifest.json
├── src/
│   ├── background/
│   │   └── service-worker.ts      # API calls, cache, pairing state
│   ├── content/
│   │   ├── shared/
│   │   │   ├── link-scanner.ts    # finds <a> tags, batches them
│   │   │   ├── link-painter.ts    # applies underline + badge
│   │   │   └── click-guard.ts     # intercepts clicks, shows modal
│   │   └── sites/
│   │       ├── gmail.ts           # site-specific selectors
│   │       └── outlook.ts
│   ├── popup/
│   │   ├── App.tsx
│   │   ├── PairingScreen.tsx
│   │   └── StatusScreen.tsx
│   └── modal/
│       └── warning-modal.ts
```

### 5.2 Per-site modules

Each supported site exports a `SiteAdapter`:

```ts
interface SiteAdapter {
  // CSS selector identifying the page region(s) to scan (e.g. message bodies).
  rootSelector: string;

  // Called per <a> element found inside rootSelector. Return false to skip
  // (e.g. UI chrome, signatures, "unsubscribe" links the user understands).
  shouldScanLink(linkEl: HTMLAnchorElement): boolean;

  // Resolve a possibly-wrapped href to the real destination.
  // Examples: google.com/url?q=..., l.facebook.com/l.php?u=...,
  // outlook.com's safelinks.protection.outlook.com.
  unwrapTrackingUrl(href: string): string;

  // Called once per page load. The adapter sets up MutationObservers as
  // appropriate for the site's SPA model and invokes onChange whenever new
  // scannable content appears. Returns a disposer.
  observeMutations(onChange: () => void): () => void;
}
```

This is the seam that lets us add Yahoo, Facebook, etc. in v0.2+ without changing core scanning logic. Each new site is one new module implementing this interface.

### 5.3 Link state visuals

| State | Visual | Click behavior |
|---|---|---|
| ✅ Safe | Subtle green underline + small ✓ badge | Opens normally |
| ❓ Unknown | Subtle gray underline + small ? badge | Opens normally |
| ⚠️ Sketchy | Yellow underline + ⚠ badge | Click intercepted → confirm modal |
| 🚨 Dangerous | Red underline + 🛑 badge | Click intercepted → strong warning modal |

The modal copy is plain English, large type, two buttons: **Go Back (default, large, green)** and **Continue Anyway (small, gray)**. The "Continue Anyway" branch logs `action: 'ignored_warning'` to the backend if paired.

### 5.4 Permissions (manifest)

- `storage` — local cache + pairing state
- `alarms` — periodic cache TTL cleanup
- `host_permissions` — *only* `mail.google.com/*` and `outlook.live.com/*` for v0.1

No `<all_urls>`, no `webRequest`, no `webRequestBlocking`. This minimizes Chrome Web Store review friction and matches the "single purpose" listing requirement.

### 5.5 Performance

- Verdict cache in `chrome.storage.local`, keyed by URL hash, 24h TTL.
- Content script batches up to 50 URLs per 200ms window before posting to the service worker.
- Service worker is the only component making network calls; content scripts never call out directly.
- All **persistent** state (verdict cache, pairing token, paired circle metadata) lives in `chrome.storage.local`, not in service-worker memory, since MV3 service workers can be killed at any time. The popup and content scripts hold only ephemeral UI state.

## 6. Web App Design

### 6.1 Routes

```
apps/web/app/
├── page.tsx                    # Single scrolling marketing page
│                                # Sections: Hero · How it works · Privacy · FAQ · Install
├── (app)/                      # Caregiver-only, Clerk-protected
│   ├── layout.tsx
│   ├── dashboard/page.tsx      # List of circles + per-circle summary
│   ├── circle/[id]/page.tsx    # Per-senior detail view
│   └── settings/page.tsx
└── api/
    ├── scan/route.ts                    # Extension → Safe Browsing proxy
    ├── pair/code/route.ts               # Generate pairing code
    ├── pair/redeem/route.ts             # Extension submits code
    ├── pair/invite/route.ts             # Email invite (v0.2)
    ├── events/log/route.ts              # Extension reports danger events
    └── events/list/route.ts             # Dashboard reads events
```

### 6.2 Marketing page

A single scrolling page with anchor sections:

- **Hero**: "Protect Mom and Dad from Phishing Scams." + Install button (links to Chrome Web Store)
- **How it works**: 3 steps (Install → Browse normally → We watch for danger)
- **Family pairing pitch**: screenshot/illustration of the dashboard, plain explanation that it doesn't read emails
- **Privacy promise**: "We never read your emails. Period." + link to detailed privacy section
- **FAQ**: install instructions, what data we see, how to cancel, how to remove the extension
- **Footer**: Privacy, Contact, Sign-in for caregivers

The user will provide visual components for this page in a follow-up session.

### 6.3 Caregiver dashboard

- **/dashboard** — list of circles (paired seniors). Each card: senior label, last activity, count of dangerous links blocked this week.
- **/circle/[id]** — timeline of danger events: *Date · Threat type · Domain · Outcome (dismissed | ignored_warning | shown)*. Includes a prominent "Generate New Pairing Code" button.
- **/settings** — caregiver profile, revoke extension tokens, delete circle, delete account.

### 6.4 API routes

| Route | Caller | Purpose |
|---|---|---|
| `POST /api/scan` | Extension service worker | Body: `{ urls: string[] }` → returns `[{ url, verdict, source }]`. Authed via `Authorization: Bearer <extension-token>` if paired, or anonymous (per-IP rate limit) if not. Response also includes `{ paired: boolean }` so the popup can update if a token has been revoked. |
| `POST /api/pair/code` | Caregiver dashboard | Generate a 6-digit code for a circle. Returns `{ code, expiresAt }`. Authed via Clerk session; caller must own the target circle. |
| `POST /api/pair/redeem` | Extension popup | Body: `{ code }` → returns `{ token, circleId, seniorLabel }` on success. Per-IP rate limited. Unauthenticated (the code is the secret). |
| `POST /api/pair/invite` | Caregiver dashboard (v0.2) | Body: `{ email, circleId }` → emails an activation link. Authed via Clerk session; caller must own the circle. |
| `POST /api/events/log` | Extension | Body: `{ url, threatType, action, sourceSite }`. Authed via `Authorization: Bearer <extension-token>`. No-op (200) if extension is unpaired — events without a circle are not stored. |
| `GET /api/events/list?circleId=...` | Dashboard | Paginated event list. Authed via Clerk session. **Authorization check**: returns 404 unless the circle's `owner_id` matches the calling user. |

### 6.5 Rate limits

- `/api/scan`: per extension token (paired) or per IP (anonymous). Hard cap chosen to comfortably handle one user reading email but block scraping abuse.
- `/api/pair/redeem`: per IP, to prevent code brute-force. 6-digit codes have 1M permutations and 1h TTL, so a per-IP cap of 10 attempts/hour is plenty.
- `/api/pair/code`: per circle, max 5 active codes (older codes auto-invalidated when a 6th is generated).

## 7. Data Model

Six tables, all in Postgres. Drizzle ORM schema definitions live in `apps/web/lib/db/schema.ts`.

```
users (caregivers only)
├── id              uuid    pk
├── clerk_user_id   text    unique
├── email           text
├── name            text
├── created_at      timestamptz

circles
├── id              uuid    pk
├── owner_id        uuid    fk → users.id
├── senior_label    text                   -- e.g. "Mom"
├── senior_email    text    nullable        -- only for invite flow (v0.2)
├── created_at      timestamptz

pairing_codes
├── id              uuid    pk
├── circle_id       uuid    fk → circles.id
├── code            text                    -- 6-digit string, plaintext, leading zeros preserved
│                                           -- ('000000' through '999999'). Stored plaintext
│                                           -- because the caregiver reads it aloud.
├── expires_at      timestamptz             -- 1h TTL
├── redeemed_at     timestamptz nullable    -- non-null = consumed, single-use

extension_tokens
├── id              uuid    pk
├── circle_id       uuid    fk → circles.id
├── token_hash      text                    -- sha256 of the bearer; raw lives only in extension
├── created_at      timestamptz
├── last_seen_at    timestamptz
├── revoked_at      timestamptz nullable

danger_events
├── id              uuid    pk
├── circle_id       uuid    fk → circles.id  nullable   -- null for unpaired use
├── url             text
├── domain          text
├── threat_type     text                                 -- 'sketchy' | 'dangerous' | SB enum
├── action          text                                 -- 'shown' | 'dismissed' | 'ignored_warning'
├── source_site     text                                 -- 'gmail' | 'outlook' | ...
├── created_at      timestamptz

scan_cache
├── url_hash        text    pk                            -- sha256 of normalized URL
├── verdict         text                                  -- 'safe' | 'sketchy' | 'dangerous' | 'unknown'
├── threat_type     text    nullable
├── checked_at      timestamptz
├── expires_at      timestamptz                           -- 6h from check
```

**Notes:**

- Pairing codes are stored plaintext on purpose: the caregiver reads the code aloud over a phone call, so we can't hash it. The 1-hour TTL plus per-IP rate limit on redeem keeps brute-force impractical.
- Extension tokens are hashed in the DB (sha256). Only the extension holds the plaintext bearer token.
- `danger_events.circle_id` is nullable so the extension is useful for unpaired seniors too.
- We never store any email content, sender, or subject. URLs only.

## 8. Error Handling & Edge Cases

- **Backend down**: `/api/scan` 3-second timeout from extension. Failure → links marked Unknown (gray ?), never silently Safe. Cached prior verdicts still apply.
- **Safe Browsing API down**: backend returns `{ verdict: 'unknown', source: 'fallback' }` (200, not 5xx) so extension doesn't retry-storm. Alerted internally if fallback rate exceeds 1% over 5 min.
- **Tracking redirects**: `google.com/url?q=...`, `l.facebook.com/l.php?u=...`, etc. unwrapped by the per-site `unwrapTrackingUrl()` helper before scanning.
- **IDN homoglyphs**: domains with mixed scripts flagged as Sketchy by local heuristic, even if Safe Browsing has not yet listed them.
- **Skipped link types**: `mailto:`, `tel:`, `javascript:`, `chrome-extension:`, `data:`, anchor-only, and relative URLs are skipped entirely.
- **Click interception**: `pointerdown` capture phase, so we beat the page's own handlers. Covers middle-click, ⌘/Ctrl+click, and right-click "open in new tab" for Sketchy/Dangerous.
- **"Continue Anyway"**: opens the link without re-scanning on arrival; logged as `action: 'ignored_warning'` if paired. The user has explicitly overridden the warning.
- **Bad pairing code**: extension shows a single message — *"That code didn't work. Ask your family for a new one."* No distinction between expired/incorrect/used (simpler for the senior).
- **Caregiver generates new code while old one is active**: older codes for that circle are invalidated.
- **Extension reinstalled**: token gone → reverts to anonymous mode. Caregiver can issue a new code.
- **Caregiver deletes circle**: token revoked. Next `/api/scan` response includes `{ paired: false }`; popup updates.
- **Repeated "Continue Anyway"**: each occurrence logged. Dashboard surfaces these prominently — they indicate active social engineering with partial success and are the most important caregiver signal.
- **Content script crash**: page renders normally, links unhighlighted. The extension never breaks page functionality on its own errors.
- **MV3 service worker termination**: all state is in `chrome.storage.local`, so cold restarts don't lose pairing or cache.
- **Shadow DOM (Gmail)**: link traversal uses `composedPath()` where needed.

## 9. MVP Scope

### v0.1 — ship first

v0.1 ships across two sessions (see §10 Build Order). The total v0.1 surface is:

**Extension:**

- Manifest V3, TypeScript, Vite + CRXJS
- **Gmail and Outlook.com** site adapters
- Subtle underline + badge for Safe / Unknown / Sketchy / Dangerous
- Click-time intercept modal for Sketchy + Dangerous
- Popup with Pairing + Status screens
- Local 24h verdict cache
- Anonymous mode supported (no pairing required for the extension to be useful)

**Web app:**

- Single scrolling marketing page (uses components the user will provide)
- Caregiver Clerk sign-in
- Dashboard: circles list + per-circle event log
- Pairing-code flow only (no email invite yet)
- API routes: `/api/scan`, `/api/pair/code`, `/api/pair/redeem`, `/api/events/log`, `/api/events/list`

**Backend (shared by both):**

- Google Safe Browsing Lookup API v4 with 6h Postgres verdict cache
- Local heuristic pre-check: typosquatting, IDN homoglyphs, suspicious TLDs, IP-address URLs, excessive subdomains
- Per-token + per-IP rate limits on `/api/scan` and `/api/pair/redeem`
- Drizzle + Neon Postgres

### v0.2

- Yahoo Mail support
- Email-invite pairing flow (Resend)
- Caregiver email/push alerts on danger events
- Onboarding polish (first-run popup walkthrough)

### v0.3+

- Facebook Messenger, Twitter/X DMs, LinkedIn messages
- Multiple seniors per caregiver, multiple caregivers per senior
- Marketing-page stats ("X scams blocked this month")
- Mobile-friendly dashboard
- Localization (Spanish first)
- Firefox / Edge ports

## 10. Build Order

Two sessions. Each ends with a working, demoable artifact.

**Session 1 — today (v0.1a):**

1. Scaffold Turborepo monorepo (`apps/web`, `apps/extension`, `packages/shared`, `packages/ui`)
2. Provision Neon Postgres + minimal Next.js app on Vercel
3. Implement `/api/scan`: Safe Browsing Lookup API v4 client + heuristic pre-check + 6h `scan_cache` table
4. Build extension: manifest, service worker, Gmail + Outlook site adapters, link painter, click guard, warning modal, popup status screen
5. End state: install the extension, open Gmail/Outlook, links get marked, clicking a known-bad URL shows the warning. **Pairing not required** — anonymous mode works end-to-end.

**Session 2 — tomorrow (v0.1b):**

1. Single-scroll marketing page using components the user supplies
2. Clerk integration + caregiver sign-in
3. Dashboard (circles list + per-circle events) and Settings
4. Pairing endpoints (`/api/pair/code`, `/api/pair/redeem`) and extension popup pairing screen
5. Event logging (`/api/events/log`, `/api/events/list`) wired into the click-guard flow
6. End state: a caregiver can sign up, generate a code, the senior types it into the extension popup, and danger events appear in the caregiver's dashboard.

**Session 3+ — release:**

- Privacy/legal copy review
- Chrome Web Store listing assets and submission
- Production deploy on Vercel + domain attached

## 11. Open Questions

- **Domain name** is not yet chosen. Spec uses `gonephishin.com` as a placeholder.
- **Google Safe Browsing API key** will be provided by the user; backend reads it from a Vercel environment variable.
- **Marketing page components** will be provided by the user in a follow-up session before the web app is built.
