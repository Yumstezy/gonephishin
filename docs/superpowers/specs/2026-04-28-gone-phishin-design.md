# Gone Phishin' — Design Spec

**Date:** 2026-04-28
**Status:** Draft — design approved in conversation, awaiting user review of this written document
**Domain:** `gonephishin.com` (placeholder, not yet registered)

## 1. Purpose

Gone Phishin' protects older and less-tech-savvy users from phishing links in their everyday browsing. It is named in reference to the 1997 film *Gone Fishin'*.

The product has two surfaces:

1. A **Chrome extension** that scans links on supported webmail and social-DM sites, marks them with a clear safety status, and intercepts clicks on dangerous ones with a plain-English warning.
2. A **single-page web app** (`gonephishin.com`) where users can install the extension, sign in, and view a dashboard of phishing attempts they (or a paired senior) have encountered.

The product supports two usage modes, switched at install time inside the extension popup:

- **Caregiver-paired mode**: an adult child creates an account, generates a 6-digit pairing code, and reads it to a senior over the phone. The senior types the code into the popup once. The caregiver sees the senior's danger events; the senior never has an account.
- **Self-managed mode**: a tech-comfortable senior creates their own account and signs into the extension directly. They see their own dashboard. No code, no third party.

Both modes share the same underlying data model and dashboard UI — the only difference is who owns the circle and how the extension gets paired to it.

## 2. Non-Goals

- We do **not** scan email content (subjects, senders, or message bodies). URLs only.
- We do **not** build our own threat intelligence — we rely on Google Safe Browsing plus a small set of local heuristics.
- We do **not** require seniors to have an account. Caregiver-paired mode lets a senior use the extension fully without ever signing up. Self-managed mode is opt-in for seniors who want their own dashboard.
- We do **not** support real-time chat, password management, or recovery flows for seniors who decline to make an account (caregiver-paired mode is the answer for that population).
- We do **not** support a single circle being shared between a self-managed senior account *and* a caregiver account in v0.1. One owner per circle. (Multi-member circles are deferred to v0.2 — see §9.)
- We do **not** request `<all_urls>` host permissions. The extension only operates on the explicit list of supported sites.

## 3. Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
│  Chrome Extension   │ ──API──▶│   Vercel Web App     │ ──API──▶│  Google Safe        │
│  (user's browser)   │         │   (gonephishin.com)  │         │  Browsing API       │
│                     │ ◀───────│   - Landing page     │         └─────────────────────┘
│  - Content scripts  │         │   - Sign-in (open)   │
│  - Service worker   │         │   - API routes       │ ──reads/writes──▶  ┌──────────┐
│  - Popup (pairing)  │         │   - Dashboard        │                    │  Neon    │
└─────────────────────┘         │   - /extension/      │                    │ Postgres │
       ▲                        │       activate       │                    └──────────┘
       │ chrome.runtime.        └──────────────────────┘
       │ sendMessage from                   │
       │ activate page (direct              │ auth via
       │ sign-in mode)                      ▼
       └────────────────────────────── ┌──────────┐
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
│   │   ├── service-worker.ts      # API calls, cache, pairing state
│   │   └── external-message.ts    # receives token from web app activate page
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
│   │   ├── ChooseModeScreen.tsx   # "I have a code" vs "Sign in for myself"
│   │   ├── CodePairingScreen.tsx  # 6-digit code entry (caregiver mode)
│   │   ├── DirectSignInScreen.tsx # opens web auth, waits for token (self mode)
│   │   └── StatusScreen.tsx       # post-pairing status display
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

The user can pick from three verbosity modes in the popup's Settings tab:

- **Minimal** — only Sketchy and Dangerous get always-visible inline marks. Everything else is hover-only via the tooltip pill.
- **Standard** *(default)* — Sketchy, Dangerous, and Unknown get always-visible inline marks. Safe is hover-only.
- **Verbose** — every link, including Safe, gets the inline mark.

Inline mark format (when applied) is a 2px colored bottom border + an inline badge after the link:

| State | Inline mark | Click behavior |
|---|---|---|
| ✅ Safe | Green underline + ✓ badge | Opens normally |
| 🔍 Unknown | Blue underline + 🔍 badge | Opens normally (with tooltip warning to be careful) |
| ⚠️ Sketchy | Amber underline + ⚠ badge | Click intercepted → confirm modal |
| 🚨 Dangerous | Red underline + 🛑 badge | Click intercepted → strong warning modal |

Hover any scanned link to bring up a **floating pill** rendered in a shadow-DOM-isolated tooltip — large icon, large headline ("Looks safe", "Not verified", "Looks suspicious", "Dangerous — don't click"), one-line explanation, and the URL in monospace. The pill is the primary signal for Safe links so the inline visuals stay clean. The pill's color and headline mirror the verdict so at-a-glance recognition is consistent across modes.

The click-time warning modal copy is plain English, large type, two buttons: **Go Back (default, large, green)** and **Continue Anyway (small, gray)**. The "Continue Anyway" branch logs `action: 'ignored_warning'` to the backend if paired.

A v0.2 enhancement (UX option C) replaces the per-link clutter problem entirely by adding a per-email banner — see §9 v0.2.

### 5.4 Permissions (manifest)

- `storage` — local cache + pairing state
- `alarms` — periodic cache TTL cleanup
- `host_permissions` — *only* `mail.google.com/*` and `outlook.live.com/*` for v0.1
- `externally_connectable.matches` — `https://gonephishin.com/*` so the web app's activate page can hand a fresh extension token to the service worker via `chrome.runtime.sendMessage` (used by direct sign-in mode)

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
├── (app)/                      # Signed-in users (caregiver OR self-managing senior)
│   ├── layout.tsx
│   ├── dashboard/page.tsx      # List of circles + per-circle summary
│   ├── circle/[id]/page.tsx    # Detail view for one circle
│   ├── settings/page.tsx
│   └── extension/activate/page.tsx   # Direct sign-in handoff page (sends token
│                                     # to extension via chrome.runtime.sendMessage)
└── api/
    ├── scan/route.ts                    # Extension → Safe Browsing proxy
    ├── pair/code/route.ts               # Generate pairing code
    ├── pair/redeem/route.ts             # Extension submits code
    ├── pair/direct/route.ts             # Mint extension token from authed session
    ├── pair/invite/route.ts             # Email invite (v0.2)
    ├── events/log/route.ts              # Extension reports danger events
    └── events/list/route.ts             # Dashboard reads events
```

### 6.2 Marketing page

A single scrolling page with anchor sections:

- **Hero**: dual headline — *"Protect yourself, or someone you love, from phishing scams."* + Install button (links to Chrome Web Store)
- **How it works**: 3 steps (Install → Browse normally → We watch for danger)
- **Two ways to use it**: side-by-side comparison of *"For yourself"* (sign in directly, see your own dashboard) vs *"For a family member"* (pair with a 6-digit code over the phone)
- **Privacy promise**: "We never read your emails. Period." + link to detailed privacy section
- **FAQ**: install instructions, what data we see, how to cancel, how to remove the extension
- **Footer**: Privacy, Contact, Sign-in

The user will provide visual components for this page in a follow-up session.

### 6.3 Dashboard

The dashboard UI is the same regardless of mode — only the framing copy adapts based on whether the signed-in user owns a self-managed or caregiver-managed circle.

- **/dashboard** — list of circles owned by the signed-in user. Each card: label, last activity, count of dangerous links blocked this week. A self-managing senior typically has one circle labeled "Me" or their own name; a caregiver may have several ("Mom", "Dad").
- **/circle/[id]** — timeline of danger events: *Date · Threat type · Domain · Outcome (dismissed | ignored_warning | shown)*. Includes a prominent "Generate New Pairing Code" button (relevant for caregiver-managed circles or for re-pairing a lost device).
- **/settings** — profile, list of active extension tokens (with "revoke" buttons), delete circle, delete account.
- **/extension/activate** — only used during direct sign-in pairing. The page is opened by the popup, requires the user to be logged into Clerk, calls `POST /api/pair/direct`, and uses `chrome.runtime.sendMessage` to hand the resulting token back to the extension. Shows "You're all set — you can close this tab" on success. Auto-creates a default circle for the user if they don't have one yet.

### 6.4 API routes

| Route | Caller | Purpose |
|---|---|---|
| `POST /api/scan` | Extension service worker | Body: `{ urls: string[] }` → returns `[{ url, verdict, source }]`. Authed via `Authorization: Bearer <extension-token>` if paired, or anonymous (per-IP rate limit) if not. Response also includes `{ paired: boolean }` so the popup can update if a token has been revoked. |
| `POST /api/pair/code` | Dashboard (caregiver) | Generate a 6-digit code for a circle. Returns `{ code, expiresAt }`. Authed via Clerk session; caller must own the target circle. |
| `POST /api/pair/redeem` | Extension popup | Body: `{ code }` → returns `{ token, circleId, label }` on success. Per-IP rate limited. Unauthenticated (the code is the secret). |
| `POST /api/pair/direct` | `/extension/activate` page | No body. Authed via Clerk session. Auto-creates a default circle for the user if none exists, mints a fresh `extension_token` for it, returns `{ token, circleId, label }`. The activate page then forwards the token to the extension via `chrome.runtime.sendMessage`. |
| `POST /api/pair/invite` | Dashboard (v0.2) | Body: `{ email, circleId }` → emails an activation link. Authed via Clerk session; caller must own the circle. |
| `POST /api/events/log` | Extension | Body: `{ url, threatType, action, sourceSite }`. Authed via `Authorization: Bearer <extension-token>`. No-op (200) if extension is unpaired — events without a circle are not stored. |
| `GET /api/events/list?circleId=...` | Dashboard | Paginated event list. Authed via Clerk session. **Authorization check**: returns 404 unless the circle's `owner_id` matches the calling user. |

### 6.5 Rate limits

- `/api/scan`: per extension token (paired) or per IP (anonymous). Hard cap chosen to comfortably handle one user reading email but block scraping abuse.
- `/api/pair/redeem`: per IP, to prevent code brute-force. 6-digit codes have 1M permutations and 1h TTL, so a per-IP cap of 10 attempts/hour is plenty.
- `/api/pair/code`: per circle, max 5 active codes (older codes auto-invalidated when a 6th is generated).
- `/api/pair/direct`: per Clerk user, max 10 fresh tokens per hour. Prevents an attacker who briefly hijacks a session from minting many long-lived tokens.

## 7. Data Model

Six tables, all in Postgres. Drizzle ORM schema definitions live in `apps/web/lib/db/schema.ts`.

```
users (anyone with an account — caregiver or self-managing senior)
├── id              uuid    pk
├── clerk_user_id   text    unique
├── email           text
├── name            text
├── created_at      timestamptz

circles
├── id              uuid    pk
├── owner_id        uuid    fk → users.id
├── label           text                    -- e.g. "Mom", "Dad", "Me"
├── mode            text                    -- 'caregiver' | 'self'
├── senior_email    text    nullable         -- only for caregiver invite flow (v0.2)
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
- `circles.mode` distinguishes self-managed (`'self'`) from caregiver-managed (`'caregiver'`) circles. Self-managed circles use the direct-sign-in pairing path; caregiver-managed circles use the 6-digit code path. The `mode` field exists primarily so the dashboard can render appropriate copy ("Your protection" vs "Mom's protection") and so we can later restrict v0.2 features (e.g., email invites) to the right mode.

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
- **Direct sign-in: user closes the activate page early**: the popup polls `/api/scan` with no token; if no message arrives within 60 seconds, it shows "Sign-in didn't finish — try again" and the user can retry.
- **Direct sign-in: extension popup is closed before token arrives**: `chrome.runtime.sendMessage` from an external page still reaches the service worker, which persists the token; on next popup open, the StatusScreen reflects the paired state.
- **Direct sign-in: user is already signed into a different Clerk account**: the activate page mints a token tied to whichever account is active in their browser. Switching accounts is a normal Clerk flow.
- **Extension reinstalled**: token gone → reverts to anonymous mode. User re-pairs (either by code or direct sign-in).
- **Owner deletes circle**: token revoked. Next `/api/scan` response includes `{ paired: false }`; popup updates and prompts re-pairing.
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
- Popup with Choose-Mode → CodePairing or DirectSignIn → Status screens
- Local 24h verdict cache
- `externally_connectable` for direct-sign-in token handoff
- Anonymous mode supported (no pairing required for the extension to be useful)

**Web app:**

- Single scrolling marketing page (uses components the user will provide)
- Clerk sign-in (open to anyone — caregivers and self-managing seniors)
- Dashboard: circles list + per-circle event log (UI adapts to mode)
- `/extension/activate` page that hands a token to the extension via `chrome.runtime.sendMessage`
- Pairing-code flow + direct-sign-in flow (no email invite yet — that's v0.2)
- API routes: `/api/scan`, `/api/pair/code`, `/api/pair/redeem`, `/api/pair/direct`, `/api/events/log`, `/api/events/list`

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
- **Multi-member circles** — let a self-managing senior add a family member as a viewer of their dashboard, or let a caregiver promote a paired senior to a real account-holder on the same circle. Adds a `circle_members` join table and access-control changes to `/api/events/list`.
- **Per-email status banner (UX option C from §5.3)** — each scanned email gets a small banner at the top: *"Gone Phishin' scanned this email. 23 links — all safe."* or *"⚠ 1 link looks dangerous — jump to it"*. Built on top of the existing scanner output by aggregating verdicts per email-body region, then injecting a single banner element above the message. Replaces the per-link visual noise problem at a higher abstraction level. Requires the site adapters to expose a "message body root" callback so the banner attaches in the right place.

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
4. Build extension: manifest (with `externally_connectable` already declared), service worker, Gmail + Outlook site adapters, link painter, click guard, warning modal, ChooseMode + Status popup screens
5. End state: install the extension, open Gmail/Outlook, links get marked, clicking a known-bad URL shows the warning. **Pairing not required** — anonymous mode works end-to-end.

**Session 2 — tomorrow (v0.1b):**

1. Single-scroll marketing page using components the user supplies
2. Clerk integration + open sign-in (caregivers AND self-managing seniors)
3. Dashboard (circles list + per-circle events) with mode-aware copy, plus Settings
4. **Caregiver pairing path**: `/api/pair/code` + `/api/pair/redeem` + popup `CodePairingScreen`
5. **Direct sign-in path**: `/extension/activate` page + `/api/pair/direct` endpoint + popup `DirectSignInScreen` + `chrome.runtime.sendMessage` handler in the service worker
6. Event logging (`/api/events/log`, `/api/events/list`) wired into the click-guard flow
7. End state: (a) a caregiver can sign up, generate a code, the senior types it into the popup, and danger events appear in the caregiver's dashboard; (b) a self-managing senior can sign up, click "Sign in for myself" in the popup, complete Clerk auth, and immediately see their own dashboard populating with events.

**Session 3+ — release:**

- Privacy/legal copy review
- Chrome Web Store listing assets and submission
- Production deploy on Vercel + domain attached

## 11. Open Questions

- **Domain name** is not yet chosen. Spec uses `gonephishin.com` as a placeholder.
- **Google Safe Browsing API key** will be provided by the user; backend reads it from a Vercel environment variable.
- **Marketing page components** will be provided by the user in a follow-up session before the web app is built.
