# Gone Phishin' — Session 2 Implementation Plan (v0.1b)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the marketing page, caregiver auth + dashboard, pairing endpoints, and the direct-sign-in handoff page so a real user can install the extension, sign up as a caregiver (or self-managing senior), pair their browser, and watch danger events flow into a live dashboard.

**Architecture:** Builds on Session 1 (extension + `/api/scan` are live). Adds Clerk for auth, four new tables (`users`, `circles`, `pairing_codes`, `extension_tokens`, `danger_events`), four new API routes (`/api/pair/code`, `/api/pair/redeem`, `/api/pair/direct`, `/api/events/log`, `/api/events/list`), the `/extension/activate` handoff page, and the marketing page composing the user-supplied components.

**Tech Stack:** Next.js 16 App Router, Clerk (Vercel Marketplace), Drizzle + Neon Postgres, Tailwind, shadcn/ui primitives + 21st.dev components already integrated, `framer-motion`, `lucide-react`. Extension popup is React + Vite.

---

## Files Created or Modified in This Session

```
apps/web/
├── middleware.ts                                       # NEW — Clerk route protection
├── app/
│   ├── layout.tsx                                      # MODIFY — wrap in <ClerkProvider>
│   ├── page.tsx                                        # MODIFY — full marketing page
│   ├── (app)/
│   │   ├── layout.tsx                                  # NEW — Clerk-gated app shell + nav
│   │   ├── dashboard/page.tsx                          # NEW — circles list
│   │   ├── circle/[id]/page.tsx                        # NEW — per-circle event timeline
│   │   ├── circle/[id]/actions.ts                      # NEW — server action: rotate code
│   │   ├── settings/page.tsx                           # NEW — caregiver settings
│   │   └── extension/activate/page.tsx                 # NEW — direct-sign-in handoff
│   ├── sign-in/[[...sign-in]]/page.tsx                 # NEW — Clerk-rendered
│   ├── sign-up/[[...sign-up]]/page.tsx                 # NEW — Clerk-rendered
│   └── api/
│       ├── pair/code/route.ts                          # NEW
│       ├── pair/redeem/route.ts                        # NEW
│       ├── pair/direct/route.ts                        # NEW
│       ├── events/log/route.ts                         # NEW
│       └── events/list/route.ts                        # NEW
├── components/
│   ├── marketing/
│   │   ├── nav.tsx                                     # NEW — top navigation w/ Logo
│   │   ├── how-it-works-section.tsx                    # NEW — wraps imported HowItWorks
│   │   ├── features-section.tsx                        # NEW — three SectionWithMockup instances
│   │   ├── stats-section.tsx                           # NEW — wraps StatisticCard10
│   │   ├── compare-paths-section.tsx                   # NEW — caregiver vs self side-by-side
│   │   ├── testimonial-section.tsx                     # NEW — wraps Testimonial
│   │   └── faq-section.tsx                             # NEW — wraps FAQ
│   └── dashboard/
│       ├── circle-card.tsx                             # NEW
│       ├── event-row.tsx                               # NEW
│       ├── pairing-code-display.tsx                    # NEW
│       └── empty-state.tsx                             # NEW
└── lib/
    ├── db/
    │   └── schema.ts                                   # MODIFY — add 4 new tables
    └── auth/
        ├── current-user.ts                             # NEW — Clerk session → DB user
        └── extension-token.ts                          # NEW — verify Bearer token
```

```
apps/extension/
└── src/popup/
    ├── App.tsx                                         # MODIFY — route from buttons
    ├── ChooseModeScreen.tsx                            # MODIFY — wire onClick handlers
    ├── CodePairingScreen.tsx                           # NEW — code entry form
    ├── DirectSignInScreen.tsx                          # NEW — sign-in launcher + token receive
    └── StatusScreen.tsx                                # MODIFY — show paired circle
```

---

## Task 1: Provision Clerk and pull env

**Files:** none directly, but adds CLERK_* env vars to `apps/web/.env.local`.

- [ ] **Step 1: Open the Vercel project's Marketplace page**

In a browser, go to:

```
https://vercel.com/echos-projects-74cc5946/gonephishin/integrations
```

Click **Browse Marketplace** → search for **Clerk** → **Add Integration**. Follow the prompts; choose **Free** plan; attach to all environments (Development, Preview, Production).

- [ ] **Step 2: Pull the new env vars locally**

```bash
cd /Users/ianbarrie/gonephisin/apps/web
vercel env pull .env.local
grep CLERK .env.local
```

Expected: `CLERK_SECRET_KEY=sk_test_...` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...` appear.

- [ ] **Step 3: Install Clerk Next.js SDK**

```bash
pnpm --filter @gonephishin/web add @clerk/nextjs
```

- [ ] **Step 4: Commit (no source change yet, just env reference)**

```bash
cd /Users/ianbarrie/gonephisin
git status
# nothing to commit; .env.local is gitignored. Move to Task 2.
```

---

## Task 2: Add Clerk middleware and wrap the app

**Files:**
- Create: `apps/web/middleware.ts`
- Modify: `apps/web/app/layout.tsx`

- [ ] **Step 1: Create `apps/web/middleware.ts`**

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only the (app) routes require auth. The marketing page, /api/scan, and
// /api/pair/redeem stay public.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/circle(.*)",
  "/settings(.*)",
  "/extension/activate(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- [ ] **Step 2: Wrap layout in `<ClerkProvider>`**

Edit `apps/web/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gone Phishin'",
  description: "Protect yourself, or someone you love, from phishing scams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 3: Verify build still works**

```bash
pnpm --filter @gonephishin/web typecheck
pnpm --filter @gonephishin/web build
```

Expected: typecheck clean, build emits without auth-related errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/middleware.ts apps/web/app/layout.tsx pnpm-lock.yaml
git commit -m "feat(web): wire Clerk middleware and ClerkProvider"
```

---

## Task 3: Add Clerk-rendered sign-in / sign-up routes

**Files:**
- Create: `apps/web/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `apps/web/app/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Create sign-in page**

`apps/web/app/sign-in/[[...sign-in]]/page.tsx`:

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#0369a1",
            borderRadius: "0.5rem",
          },
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create sign-up page**

`apps/web/app/sign-up/[[...sign-up]]/page.tsx`:

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#0369a1",
            borderRadius: "0.5rem",
          },
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Smoke-test locally**

```bash
pnpm --filter @gonephishin/web dev
```

Visit `http://localhost:3000/sign-up` → Clerk widget renders with the sky-700 primary applied. Sign up with a fresh email. Verify you can sign in. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/sign-in apps/web/app/sign-up
git commit -m "feat(web): add Clerk-themed sign-in and sign-up pages"
```

---

## Task 4: Add the four new database tables

**Files:**
- Modify: `apps/web/lib/db/schema.ts`

- [ ] **Step 1: Append to `apps/web/lib/db/schema.ts`** (do NOT touch `scanCache` or `rateLimitBuckets`)

```ts
import { uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const circles = pgTable("circles", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull(), // FK → users.id, enforced in app code
  label: text("label").notNull(),
  mode: text("mode").notNull(), // 'caregiver' | 'self'
  seniorEmail: text("senior_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pairingCodes = pgTable("pairing_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  circleId: uuid("circle_id").notNull(),
  code: text("code").notNull(), // 6-digit string, plaintext, leading zeros preserved
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
});

export const extensionTokens = pgTable("extension_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  circleId: uuid("circle_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export const dangerEvents = pgTable("danger_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  circleId: uuid("circle_id"), // nullable — anonymous-mode events have no circle
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  threatType: text("threat_type").notNull(),
  action: text("action").notNull(), // 'shown' | 'dismissed' | 'ignored_warning'
  sourceSite: text("source_site").notNull(), // 'gmail' | 'outlook' | ...
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserRow = typeof users.$inferSelect;
export type CircleRow = typeof circles.$inferSelect;
export type PairingCodeRow = typeof pairingCodes.$inferSelect;
export type ExtensionTokenRow = typeof extensionTokens.$inferSelect;
export type DangerEventRow = typeof dangerEvents.$inferSelect;
```

- [ ] **Step 2: Generate the migration**

```bash
cd apps/web
DATABASE_URL=postgres://placeholder pnpm db:generate
ls drizzle/
```

Expected: a new migration like `0001_*.sql` appears. Inspect it; should `CREATE TABLE` for the five new tables.

- [ ] **Step 3: Run the migration on the live DB**

```bash
pnpm db:migrate
```

Expected: `Migrations applied.` Verify the new tables exist via the Neon dashboard or by querying.

- [ ] **Step 4: Commit**

```bash
cd /Users/ianbarrie/gonephisin
git add apps/web/lib/db/schema.ts apps/web/drizzle
git commit -m "feat(web): add users, circles, pairing_codes, extension_tokens, danger_events"
```

---

## Task 5: Auth helpers — current user and extension token verification

**Files:**
- Create: `apps/web/lib/auth/current-user.ts`
- Create: `apps/web/lib/auth/extension-token.ts`

- [ ] **Step 1: `apps/web/lib/auth/current-user.ts`**

```ts
import { auth, currentUser as currentClerkUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, type UserRow } from "../db/schema";

/**
 * Resolve the signed-in Clerk session to a row in our `users` table.
 * Auto-creates the row on first sign-in. Throws if no session.
 */
export async function getOrCreateCurrentUser(): Promise<UserRow> {
  const { userId } = await auth();
  if (!userId) throw new Error("not signed in");

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);
  if (existing[0]) return existing[0];

  const clerkUser = await currentClerkUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    null;

  const [created] = await db
    .insert(users)
    .values({ clerkUserId: userId, email, name })
    .returning();
  if (!created) throw new Error("failed to create user");
  return created;
}
```

- [ ] **Step 2: `apps/web/lib/auth/extension-token.ts`**

```ts
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/client";
import { extensionTokens, type ExtensionTokenRow } from "../db/schema";

/** Generate a fresh bearer token. The plaintext is returned ONCE; only the
 * sha256 hash is stored. */
export function mintTokenForCircle(circleId: string): {
  plaintext: string;
  row: Promise<ExtensionTokenRow>;
} {
  const plaintext = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(plaintext).digest("hex");
  const row = db
    .insert(extensionTokens)
    .values({ circleId, tokenHash })
    .returning()
    .then((rows) => {
      const r = rows[0];
      if (!r) throw new Error("failed to insert extension_token");
      return r;
    });
  return { plaintext, row };
}

/** Look up a token by Authorization header. Returns null if missing,
 * malformed, or revoked. */
export async function verifyExtensionToken(
  authorizationHeader: string | null,
): Promise<{ tokenId: string; circleId: string } | null> {
  if (!authorizationHeader) return null;
  const match = /^Bearer (.+)$/.exec(authorizationHeader);
  if (!match) return null;
  const plaintext = match[1]!;
  const tokenHash = createHash("sha256").update(plaintext).digest("hex");

  const rows = await db
    .select()
    .from(extensionTokens)
    .where(
      and(eq(extensionTokens.tokenHash, tokenHash), isNull(extensionTokens.revokedAt)),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  // Bump last_seen — best-effort, don't await.
  void db
    .update(extensionTokens)
    .set({ lastSeenAt: new Date() })
    .where(eq(extensionTokens.id, row.id));

  return { tokenId: row.id, circleId: row.circleId };
}
```

- [ ] **Step 3: Typecheck and commit**

```bash
pnpm --filter @gonephishin/web typecheck
git add apps/web/lib/auth
git commit -m "feat(web): Clerk-to-user resolver + extension token mint/verify helpers"
```

---

## Task 6: `/api/pair/code` and `/api/pair/redeem`

**Files:**
- Create: `apps/web/app/api/pair/code/route.ts`
- Create: `apps/web/app/api/pair/redeem/route.ts`

- [ ] **Step 1: `apps/web/app/api/pair/code/route.ts`**

```ts
import { NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles, pairingCodes } from "@/lib/db/schema";

export const runtime = "nodejs";

const TTL_MS = 60 * 60 * 1000; // 1h
const MAX_ACTIVE = 5;

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { circleId?: string };
  if (!body.circleId) {
    return NextResponse.json({ error: "circleId required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();

  // Authorization: caller must own the circle
  const circle = await db
    .select()
    .from(circles)
    .where(and(eq(circles.id, body.circleId), eq(circles.ownerId, user.id)))
    .limit(1);
  if (!circle[0]) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Invalidate any active codes beyond MAX_ACTIVE
  const active = await db
    .select()
    .from(pairingCodes)
    .where(
      and(
        eq(pairingCodes.circleId, body.circleId),
        isNull(pairingCodes.redeemedAt),
        gt(pairingCodes.expiresAt, new Date()),
      ),
    );
  if (active.length >= MAX_ACTIVE) {
    // Mark the oldest as redeemed-now to retire it
    const oldest = active.sort(
      (a, b) => a.expiresAt.getTime() - b.expiresAt.getTime(),
    )[0];
    if (oldest) {
      await db
        .update(pairingCodes)
        .set({ redeemedAt: new Date() })
        .where(eq(pairingCodes.id, oldest.id));
    }
  }

  const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  const expiresAt = new Date(Date.now() + TTL_MS);

  const [row] = await db
    .insert(pairingCodes)
    .values({ circleId: body.circleId, code, expiresAt })
    .returning();
  if (!row) throw new Error("insert failed");

  return NextResponse.json({ code: row.code, expiresAt: row.expiresAt });
}
```

- [ ] **Step 2: `apps/web/app/api/pair/redeem/route.ts`**

```ts
import { NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import { mintTokenForCircle } from "@/lib/auth/extension-token";
import { db } from "@/lib/db/client";
import { circles, pairingCodes } from "@/lib/db/schema";
import { takeToken } from "@/lib/rate-limit";

export const runtime = "nodejs";
const RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 }; // 10/hr/IP

export async function POST(request: Request): Promise<Response> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await takeToken("redeem", ip, RATE_LIMIT))) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const body = (await request.json()) as { code?: string };
  if (!body.code || !/^\d{6}$/.test(body.code)) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  // Look up the active code
  const rows = await db
    .select()
    .from(pairingCodes)
    .where(
      and(
        eq(pairingCodes.code, body.code),
        isNull(pairingCodes.redeemedAt),
        gt(pairingCodes.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const codeRow = rows[0];
  if (!codeRow) {
    return NextResponse.json({ error: "invalid code" }, { status: 400 });
  }

  // Mark the code redeemed (single use)
  await db
    .update(pairingCodes)
    .set({ redeemedAt: new Date() })
    .where(eq(pairingCodes.id, codeRow.id));

  // Look up circle for label
  const circle = await db
    .select()
    .from(circles)
    .where(eq(circles.id, codeRow.circleId))
    .limit(1);
  const c = circle[0];
  if (!c) return NextResponse.json({ error: "circle missing" }, { status: 410 });

  // Mint a token
  const { plaintext, row } = mintTokenForCircle(c.id);
  await row;

  return NextResponse.json({
    token: plaintext,
    circleId: c.id,
    label: c.label,
  });
}
```

- [ ] **Step 3: Smoke test locally**

```bash
cd /Users/ianbarrie/gonephisin
pnpm --filter @gonephishin/web dev
```

In another terminal — first sign up via the web app (so a `users` row exists). Then manually insert a circle in the DB (you'll automate this in Task 8 with a server action; for now just confirm the endpoints respond with reasonable HTTP codes). Stop the server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/api/pair
git commit -m "feat(web): /api/pair/code and /api/pair/redeem endpoints"
```

---

## Task 7: `/api/pair/direct` (used by the activate handoff page)

**Files:**
- Create: `apps/web/app/api/pair/direct/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { mintTokenForCircle } from "@/lib/auth/extension-token";
import { db } from "@/lib/db/client";
import { circles } from "@/lib/db/schema";
import { takeToken } from "@/lib/rate-limit";

export const runtime = "nodejs";
const RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

export async function POST(): Promise<Response> {
  const user = await getOrCreateCurrentUser();

  if (!(await takeToken("direct", user.id, RATE_LIMIT))) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  // Find or create a self-mode circle for this user
  const existing = await db
    .select()
    .from(circles)
    .where(and(eq(circles.ownerId, user.id), eq(circles.mode, "self")))
    .limit(1);
  let circle = existing[0];
  if (!circle) {
    const [created] = await db
      .insert(circles)
      .values({
        ownerId: user.id,
        label: user.name ?? "Me",
        mode: "self",
      })
      .returning();
    if (!created) throw new Error("failed to create self circle");
    circle = created;
  }

  const { plaintext, row } = mintTokenForCircle(circle.id);
  await row;

  return NextResponse.json({
    token: plaintext,
    circleId: circle.id,
    label: circle.label,
  });
}
```

- [ ] **Step 2: Typecheck and commit**

```bash
pnpm --filter @gonephishin/web typecheck
git add apps/web/app/api/pair/direct
git commit -m "feat(web): /api/pair/direct endpoint mints token from Clerk session"
```

---

## Task 8: `/api/events/log` and `/api/events/list`

**Files:**
- Create: `apps/web/app/api/events/log/route.ts`
- Create: `apps/web/app/api/events/list/route.ts`

- [ ] **Step 1: `apps/web/app/api/events/log/route.ts`**

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { dangerEvents } from "@/lib/db/schema";
import { verifyExtensionToken } from "@/lib/auth/extension-token";

export const runtime = "nodejs";

interface LogBody {
  url: string;
  threatType: string;
  action: "shown" | "dismissed" | "ignored_warning";
  sourceSite: string;
}

export async function POST(request: Request): Promise<Response> {
  const auth = await verifyExtensionToken(request.headers.get("authorization"));
  // Unauthed events are silently dropped (anonymous mode).
  if (!auth) return NextResponse.json({ ok: true });

  const body = (await request.json()) as LogBody;
  if (!body.url || !body.threatType || !body.action || !body.sourceSite) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  let domain = "";
  try {
    domain = new URL(body.url).hostname;
  } catch {
    return NextResponse.json({ error: "bad url" }, { status: 400 });
  }

  await db.insert(dangerEvents).values({
    circleId: auth.circleId,
    url: body.url,
    domain,
    threatType: body.threatType,
    action: body.action,
    sourceSite: body.sourceSite,
  });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: `apps/web/app/api/events/list/route.ts`**

```ts
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles, dangerEvents } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const circleId = url.searchParams.get("circleId");
  if (!circleId) {
    return NextResponse.json({ error: "circleId required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();

  // Ownership check — must own the circle, otherwise 404 (not 403)
  const owns = await db
    .select()
    .from(circles)
    .where(and(eq(circles.id, circleId), eq(circles.ownerId, user.id)))
    .limit(1);
  if (!owns[0]) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const events = await db
    .select()
    .from(dangerEvents)
    .where(eq(dangerEvents.circleId, circleId))
    .orderBy(desc(dangerEvents.createdAt))
    .limit(200);

  return NextResponse.json({ events });
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/events
git commit -m "feat(web): /api/events/log (extension) and /api/events/list (dashboard)"
```

---

## Task 9: Caregiver dashboard layout shell

**Files:**
- Create: `apps/web/app/(app)/layout.tsx`

- [ ] **Step 1: Create the shell**

```tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo size={32} />
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:text-primary">
              Dashboard
            </Link>
            <Link href="/settings" className="hover:text-primary">
              Settings
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/\(app\)/layout.tsx
git commit -m "feat(web): caregiver dashboard layout with Clerk UserButton"
```

---

## Task 10: Dashboard — circles list + create circle

**Files:**
- Create: `apps/web/components/dashboard/circle-card.tsx`
- Create: `apps/web/components/dashboard/empty-state.tsx`
- Create: `apps/web/app/(app)/dashboard/page.tsx`
- Create: `apps/web/app/(app)/dashboard/actions.ts`

- [ ] **Step 1: Server action for creating a circle**

`apps/web/app/(app)/dashboard/actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles } from "@/lib/db/schema";

export async function createCircleAction(formData: FormData): Promise<void> {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;

  const user = await getOrCreateCurrentUser();
  const [row] = await db
    .insert(circles)
    .values({ ownerId: user.id, label, mode: "caregiver" })
    .returning();
  if (!row) return;
  revalidatePath("/dashboard");
  redirect(`/circle/${row.id}`);
}
```

- [ ] **Step 2: Card component**

`apps/web/components/dashboard/circle-card.tsx`:

```tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelativeTimeCard } from "@/components/ui/relative-time-card-1";

export interface CircleCardProps {
  id: string;
  label: string;
  mode: "caregiver" | "self";
  weeklyDangerCount: number;
  lastActivity: Date | null;
}

export function CircleCard(props: CircleCardProps) {
  return (
    <Link href={`/circle/${props.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{props.label}</span>
            {props.weeklyDangerCount > 0 && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                {props.weeklyDangerCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {props.lastActivity ? (
            <RelativeTimeCard date={props.lastActivity.getTime()} side="top">
              <span>
                Last activity{" "}
                <time dateTime={props.lastActivity.toISOString()}>
                  {timeAgo(props.lastActivity)}
                </time>
              </span>
            </RelativeTimeCard>
          ) : (
            <span>No activity yet — pair the extension to start.</span>
          )}
          <div className="mt-1 text-xs uppercase tracking-wide">
            {props.mode === "self" ? "Self-managed" : "Family-paired"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function timeAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
```

- [ ] **Step 3: Empty state**

`apps/web/components/dashboard/empty-state.tsx`:

```tsx
import { Button } from "@/components/ui/button";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <h2 className="mb-2 text-xl font-semibold">No one paired yet</h2>
      <p className="mb-6 text-muted-foreground">
        Add your first family member to start protecting them.
      </p>
      <Button onClick={onAdd}>Add a family member</Button>
    </div>
  );
}
```

- [ ] **Step 4: Dashboard page**

`apps/web/app/(app)/dashboard/page.tsx`:

```tsx
import { and, eq, gte, sql } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { CircleCard } from "@/components/dashboard/circle-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db/client";
import { circles, dangerEvents } from "@/lib/db/schema";
import { createCircleAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getOrCreateCurrentUser();
  const myCircles = await db
    .select()
    .from(circles)
    .where(eq(circles.ownerId, user.id));

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const counts = await db
    .select({
      circleId: dangerEvents.circleId,
      count: sql<number>`count(*)::int`,
      latest: sql<Date>`max(${dangerEvents.createdAt})`,
    })
    .from(dangerEvents)
    .where(
      and(
        gte(dangerEvents.createdAt, oneWeekAgo),
        sql`${dangerEvents.threatType} <> 'safe'`,
      ),
    )
    .groupBy(dangerEvents.circleId);

  const byCircle = new Map(counts.map((c) => [c.circleId, c]));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your circles</h1>
        <form action={createCircleAction} className="flex items-center gap-2">
          <Input
            name="label"
            placeholder="Mom, Dad, Grandma…"
            className="w-48"
            required
          />
          <Button type="submit">Add</Button>
        </form>
      </div>

      {myCircles.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No circles yet — add your first family member above.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myCircles.map((c) => {
            const stat = byCircle.get(c.id);
            return (
              <CircleCard
                key={c.id}
                id={c.id}
                label={c.label}
                mode={c.mode as "caregiver" | "self"}
                weeklyDangerCount={stat?.count ?? 0}
                lastActivity={stat?.latest ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Smoke-test**

```bash
pnpm --filter @gonephishin/web dev
```

Sign in. Visit `/dashboard`. Add a circle named "Mom". Should redirect to `/circle/<id>` (which we'll build next, so it'll 404 — that's fine for now). Stop the server.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/\(app\)/dashboard apps/web/components/dashboard
git commit -m "feat(web): dashboard circles list with create-circle server action"
```

---

## Task 11: Circle detail page — event timeline + pairing-code button

**Files:**
- Create: `apps/web/components/dashboard/event-row.tsx`
- Create: `apps/web/components/dashboard/pairing-code-display.tsx`
- Create: `apps/web/app/(app)/circle/[id]/page.tsx`
- Create: `apps/web/app/(app)/circle/[id]/actions.ts`

- [ ] **Step 1: Event row**

`apps/web/components/dashboard/event-row.tsx`:

```tsx
import { RelativeTimeCard } from "@/components/ui/relative-time-card-1";

export interface EventRowProps {
  createdAt: Date;
  threatType: string;
  domain: string;
  action: "shown" | "dismissed" | "ignored_warning";
  sourceSite: string;
}

const ACTION_COPY: Record<EventRowProps["action"], { label: string; tone: "ok" | "warn" | "bad" }> = {
  shown: { label: "Warning shown", tone: "warn" },
  dismissed: { label: "Senior went back ✓", tone: "ok" },
  ignored_warning: { label: "Senior continued anyway", tone: "bad" },
};

export function EventRow(props: EventRowProps) {
  const ac = ACTION_COPY[props.action];
  const toneClass =
    ac.tone === "ok"
      ? "text-emerald-700 bg-emerald-50"
      : ac.tone === "warn"
      ? "text-amber-700 bg-amber-50"
      : "text-rose-700 bg-rose-50";

  return (
    <div className="grid grid-cols-12 gap-4 items-center rounded-lg border border-border p-4">
      <div className="col-span-2 text-sm text-muted-foreground">
        <RelativeTimeCard date={props.createdAt.getTime()} side="top">
          <time dateTime={props.createdAt.toISOString()}>
            {props.createdAt.toLocaleDateString()}
          </time>
        </RelativeTimeCard>
      </div>
      <div className="col-span-3 text-sm font-medium">{props.threatType}</div>
      <div className="col-span-4 text-sm font-mono truncate">{props.domain}</div>
      <div className="col-span-2 text-xs uppercase text-muted-foreground">
        {props.sourceSite}
      </div>
      <div className="col-span-1">
        <span className={`text-xs rounded-full px-2 py-0.5 ${toneClass}`}>
          {ac.label}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Pairing-code display (client component, calls API)**

`apps/web/components/dashboard/pairing-code-display.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PairingCodeDisplay({ circleId }: { circleId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-2 text-lg font-semibold">Pairing code</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Read this code to your family member over the phone. They type it
        into the Gone Phishin' extension on their browser.
      </p>
      {code ? (
        <div className="space-y-2">
          <div className="font-mono text-4xl tracking-[0.4em] text-primary">
            {code}
          </div>
          {expiresAt && (
            <p className="text-xs text-muted-foreground">
              Expires {expiresAt.toLocaleTimeString()}
            </p>
          )}
          <Button variant="outline" onClick={generate} disabled={loading}>
            {loading ? "Generating…" : "New code"}
          </Button>
        </div>
      ) : (
        <Button onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Generate pairing code"}
        </Button>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Circle detail page**

`apps/web/app/(app)/circle/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { EventRow } from "@/components/dashboard/event-row";
import { PairingCodeDisplay } from "@/components/dashboard/pairing-code-display";
import { db } from "@/lib/db/client";
import { circles, dangerEvents } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function CirclePage(
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const user = await getOrCreateCurrentUser();

  const rows = await db
    .select()
    .from(circles)
    .where(and(eq(circles.id, id), eq(circles.ownerId, user.id)))
    .limit(1);
  const circle = rows[0];
  if (!circle) notFound();

  const events = await db
    .select()
    .from(dangerEvents)
    .where(eq(dangerEvents.circleId, id))
    .orderBy(desc(dangerEvents.createdAt))
    .limit(200);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{circle.label}</h1>
        <p className="text-muted-foreground">
          {circle.mode === "self" ? "Self-managed" : "Family-paired"} circle
        </p>
      </div>

      {circle.mode === "caregiver" && <PairingCodeDisplay circleId={circle.id} />}

      <div>
        <h2 className="mb-4 text-xl font-semibold">Activity</h2>
        {events.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No danger events yet. Once the extension sees a sketchy or
            dangerous link, it will appear here.
          </p>
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <EventRow
                key={e.id}
                createdAt={e.createdAt}
                threatType={e.threatType}
                domain={e.domain}
                action={e.action as "shown" | "dismissed" | "ignored_warning"}
                sourceSite={e.sourceSite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/\(app\)/circle apps/web/components/dashboard
git commit -m "feat(web): circle detail page with pairing code generator and event timeline"
```

---

## Task 12: Settings page — revoke tokens, delete circles

**Files:**
- Create: `apps/web/app/(app)/settings/page.tsx`
- Create: `apps/web/app/(app)/settings/actions.ts`

- [ ] **Step 1: Server actions**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles, extensionTokens } from "@/lib/db/schema";

export async function revokeTokenAction(formData: FormData): Promise<void> {
  const tokenId = String(formData.get("tokenId") ?? "");
  if (!tokenId) return;
  const user = await getOrCreateCurrentUser();
  // Verify the token belongs to one of the user's circles
  const myCircleIds = (
    await db.select().from(circles).where(eq(circles.ownerId, user.id))
  ).map((c) => c.id);
  const matching = await db
    .select()
    .from(extensionTokens)
    .where(eq(extensionTokens.id, tokenId))
    .limit(1);
  if (!matching[0] || !myCircleIds.includes(matching[0].circleId)) return;

  await db
    .update(extensionTokens)
    .set({ revokedAt: new Date() })
    .where(eq(extensionTokens.id, tokenId));
  revalidatePath("/settings");
}

export async function deleteCircleAction(formData: FormData): Promise<void> {
  const circleId = String(formData.get("circleId") ?? "");
  if (!circleId) return;
  const user = await getOrCreateCurrentUser();
  await db
    .delete(circles)
    .where(and(eq(circles.id, circleId), eq(circles.ownerId, user.id)));
  // Cascade: revoke tokens for that circle
  await db
    .update(extensionTokens)
    .set({ revokedAt: new Date() })
    .where(eq(extensionTokens.circleId, circleId));
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}
```

- [ ] **Step 2: Settings page**

```tsx
import { eq, isNull } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db/client";
import { circles, extensionTokens } from "@/lib/db/schema";
import { deleteCircleAction, revokeTokenAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getOrCreateCurrentUser();
  const myCircles = await db
    .select()
    .from(circles)
    .where(eq(circles.ownerId, user.id));

  const myCircleIds = myCircles.map((c) => c.id);
  const tokens = myCircleIds.length
    ? await db
        .select()
        .from(extensionTokens)
        .where(isNull(extensionTokens.revokedAt))
    : [];
  const myActiveTokens = tokens.filter((t) => myCircleIds.includes(t.circleId));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Signed in as <strong>{user.email}</strong>
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Active extensions</h2>
        {myActiveTokens.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active paired extensions.
          </p>
        ) : (
          <ul className="space-y-2">
            {myActiveTokens.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <span className="text-sm">
                  Last seen{" "}
                  {t.lastSeenAt ? t.lastSeenAt.toLocaleString() : "never"}
                </span>
                <form action={revokeTokenAction}>
                  <input type="hidden" name="tokenId" value={t.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Revoke
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Circles</h2>
        <ul className="space-y-2">
          {myCircles.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm font-medium">{c.label}</span>
              <form action={deleteCircleAction}>
                <input type="hidden" name="circleId" value={c.id} />
                <Button type="submit" variant="destructive" size="sm">
                  Delete
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/\(app\)/settings
git commit -m "feat(web): settings page with token revoke and circle delete"
```

---

## Task 13: `/extension/activate` direct sign-in handoff page

**Files:**
- Create: `apps/web/app/(app)/extension/activate/page.tsx`

The page mints a token via `/api/pair/direct`, then forwards it to the extension via `chrome.runtime.sendMessage`. The Chrome extension ID needs to be hard-coded (or read from an env var) — for v0.1b we read from a public env var so dev and prod can differ.

- [ ] **Step 1: Add the extension ID env var to the example file**

`apps/web/.env.example`:

```
# Chrome Web Store extension ID (or unpacked-dev ID). Embedded into the
# activate page so it can sendMessage to the extension. For unpacked dev,
# get this from chrome://extensions after loading apps/extension/dist.
NEXT_PUBLIC_EXTENSION_ID=
```

Add the value to your local `apps/web/.env.local` and to Vercel:

```bash
cd apps/web
vercel env add NEXT_PUBLIC_EXTENSION_ID development
# paste the value when prompted (read it from chrome://extensions for unpacked)
```

- [ ] **Step 2: Activate page**

```tsx
"use client";

import { useEffect, useState } from "react";

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

export default function ActivatePage() {
  const [status, setStatus] = useState<
    "starting" | "minting" | "sending" | "done" | "error"
  >("starting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void run();

    async function run() {
      if (!EXTENSION_ID) {
        setStatus("error");
        setError("NEXT_PUBLIC_EXTENSION_ID is not set");
        return;
      }
      try {
        setStatus("minting");
        const res = await fetch("/api/pair/direct", { method: "POST" });
        if (!res.ok) throw new Error(`mint failed: ${res.status}`);
        const data = (await res.json()) as {
          token: string;
          circleId: string;
          label: string;
        };

        setStatus("sending");
        // chrome.runtime.sendMessage is exposed on web pages listed in the
        // extension's externally_connectable.matches.
        const chromeApi = (
          globalThis as unknown as {
            chrome?: { runtime?: { sendMessage?: Function } };
          }
        ).chrome;
        if (!chromeApi?.runtime?.sendMessage) {
          throw new Error(
            "Chrome extension API not available. Are you in Chrome with the extension installed?",
          );
        }
        await new Promise<void>((resolve, reject) => {
          chromeApi.runtime!.sendMessage!(
            EXTENSION_ID,
            { type: "activate-with-token", ...data },
            (response: { ok?: boolean } | undefined) => {
              if (response?.ok) resolve();
              else reject(new Error("extension did not acknowledge"));
            },
          );
        });
        setStatus("done");
      } catch (e) {
        setStatus("error");
        setError((e as Error).message);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      {status === "done" ? (
        <>
          <h1 className="mb-2 text-2xl font-semibold">You&apos;re all set</h1>
          <p className="text-muted-foreground">
            Gone Phishin&apos; is now connected. You can close this tab.
          </p>
        </>
      ) : status === "error" ? (
        <>
          <h1 className="mb-2 text-2xl font-semibold text-destructive">
            Sign-in didn&apos;t finish
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-semibold">Connecting…</h1>
          <p className="text-muted-foreground">
            {status === "minting" && "Generating your secure code…"}
            {status === "sending" && "Sending it to your browser…"}
            {status === "starting" && "Starting…"}
          </p>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/\(app\)/extension apps/web/.env.example
git commit -m "feat(web): /extension/activate handoff page"
```

---

## Task 14: Marketing nav with logo

**Files:**
- Create: `apps/web/components/marketing/nav.tsx`

- [ ] **Step 1: Top nav**

```tsx
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function MarketingNav() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo size={32} />
        <div className="flex items-center gap-4">
          <Link href="#how-it-works" className="text-sm text-white hover:underline">
            How it works
          </Link>
          <Link href="#faq" className="text-sm text-white hover:underline">
            FAQ
          </Link>
          <SignedOut>
            <Link href="/sign-in" className="text-sm text-white hover:underline">
              Sign in
            </Link>
            <Button asChild size="sm">
              <Link href="/sign-up">Install free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/marketing/nav.tsx
git commit -m "feat(web): marketing top nav with Clerk-aware sign-in/dashboard buttons"
```

---

## Task 15: Compose the marketing page

**Files:**
- Modify: `apps/web/app/page.tsx`
- Create: `apps/web/components/marketing/compare-paths-section.tsx`

- [ ] **Step 1: Compare-paths section (the single user-facing component we don't have a 21st.dev source for)**

```tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ComparePathsSection() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-2 text-center text-4xl font-semibold">
          Two ways to use Gone Phishin&apos;
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Whichever side you&apos;re on, the protection is the same.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>For yourself</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sign in directly, see your own dashboard, no one else needs to
                be involved.
              </p>
              <Button asChild className="w-full">
                <Link href="/sign-up">Sign up — it&apos;s free</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For a family member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create your account, generate a 6-digit code, read it to them
                over the phone. They type it once. You see what dangerous
                links they encounter — without ever reading their email.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Set up a family circle</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Compose the page**

```tsx
import { Hero } from "@/components/marketing/hero";
import { MarketingNav } from "@/components/marketing/nav";
import { ComparePathsSection } from "@/components/marketing/compare-paths-section";
import { HowItWorks } from "@/components/ui/how-it-works";
import { FAQ } from "@/components/ui/faq";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <MarketingNav />
      <Hero />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <ComparePathsSection />
      <section id="faq">
        <FAQ />
      </section>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Smoke-test locally**

```bash
pnpm --filter @gonephishin/web dev
```

Visit `http://localhost:3000`. Hero loads, nav works, scrolling to `#how-it-works` and `#faq` works, the compare section renders. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/page.tsx apps/web/components/marketing/compare-paths-section.tsx
git commit -m "feat(web): full marketing page composing Hero + HowItWorks + Compare + FAQ + Footer"
```

---

## Task 16: Wire extension popup pairing screens

**Files:**
- Create: `apps/extension/src/popup/CodePairingScreen.tsx`
- Create: `apps/extension/src/popup/DirectSignInScreen.tsx`
- Modify: `apps/extension/src/popup/App.tsx`
- Modify: `apps/extension/src/popup/ChooseModeScreen.tsx`
- Modify: `apps/extension/src/popup/StatusScreen.tsx`
- Modify: `apps/extension/src/background/service-worker.ts` (handle the activate-with-token message from web app)

- [ ] **Step 1: Add a paired-state shared module**

`apps/extension/src/shared/paired-state.ts`:

```ts
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
```

- [ ] **Step 2: CodePairingScreen**

```tsx
import { useState } from "react";
import { API_BASE_URL } from "../shared/env.js";
import { setPairedState } from "../shared/paired-state.js";

export function CodePairingScreen({
  onDone,
  onBack,
}: {
  onDone: () => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pair/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setError("That code didn't work. Ask your family for a new one.");
        return;
      }
      const data = (await res.json()) as {
        token: string;
        circleId: string;
        label: string;
      };
      await setPairedState({ token: data.token, circleId: data.circleId, label: data.label });
      onDone();
    } catch {
      setError("Couldn't reach the server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Type the code from your family</h1>
      <p>They&apos;ll have read it to you over the phone — six digits.</p>
      <form onSubmit={submit} className="buttons">
        <input
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          autoFocus
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          style={{
            fontSize: 28,
            letterSpacing: "0.4em",
            textAlign: "center",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />
        <button type="submit" className="button" disabled={loading || code.length !== 6}>
          {loading ? "Checking…" : "Confirm"}
        </button>
        <button type="button" className="button" onClick={onBack}>
          Back
        </button>
      </form>
      {error && <p className="note" style={{ color: "#b91c1c" }}>{error}</p>}
    </>
  );
}
```

- [ ] **Step 3: DirectSignInScreen**

```tsx
import { useEffect } from "react";
import { API_BASE_URL } from "../shared/env.js";
import { getPairedState } from "../shared/paired-state.js";

export function DirectSignInScreen({
  onDone,
  onBack,
}: {
  onDone: () => void;
  onBack: () => void;
}) {
  // Polls paired-state every 2s; service worker writes it when the activate
  // page sends the token via runtime.sendMessage.
  useEffect(() => {
    const id = setInterval(async () => {
      if (await getPairedState()) onDone();
    }, 2000);
    return () => clearInterval(id);
  }, [onDone]);

  function open() {
    chrome.tabs.create({ url: `${API_BASE_URL}/extension/activate` });
  }

  return (
    <>
      <h1>Sign in for yourself</h1>
      <p>
        We&apos;ll open a sign-in page in a new tab. Once you&apos;re signed in,
        come back here.
      </p>
      <div className="buttons">
        <button className="button" onClick={open}>
          Open sign-in
        </button>
        <button className="button" onClick={onBack}>
          Back
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Update ChooseModeScreen and App routing**

`apps/extension/src/popup/ChooseModeScreen.tsx`:

```tsx
export function ChooseModeScreen({
  onPickCode,
  onPickDirect,
}: {
  onPickCode: () => void;
  onPickDirect: () => void;
}) {
  return (
    <>
      <h1>How will you use Gone Phishin&apos;?</h1>
      <p>Pick one. You can change later.</p>
      <div className="buttons">
        <button className="button" onClick={onPickCode}>
          I have a code from family
        </button>
        <button className="button" onClick={onPickDirect}>
          This is for myself — sign in
        </button>
      </div>
    </>
  );
}
```

`apps/extension/src/popup/App.tsx`:

```tsx
import { useEffect, useState } from "react";
import { ChooseModeScreen } from "./ChooseModeScreen.js";
import { CodePairingScreen } from "./CodePairingScreen.js";
import { DirectSignInScreen } from "./DirectSignInScreen.js";
import { SettingsScreen } from "./SettingsScreen.js";
import { StatusScreen } from "./StatusScreen.js";
import { getPairedState, type PairedState } from "../shared/paired-state.js";

type Tab = "protection" | "settings";
type ProtectionView = "status" | "choose" | "code" | "direct";

export function App() {
  const [tab, setTab] = useState<Tab>("protection");
  const [view, setView] = useState<ProtectionView>("status");
  const [paired, setPaired] = useState<PairedState | null>(null);

  useEffect(() => {
    void getPairedState().then(setPaired);
  }, [view]);

  return (
    <>
      <nav className="tabs">
        <button
          className={`tab ${tab === "protection" ? "active" : ""}`}
          onClick={() => setTab("protection")}
        >
          Protection
        </button>
        <button
          className={`tab ${tab === "settings" ? "active" : ""}`}
          onClick={() => setTab("settings")}
        >
          Settings
        </button>
      </nav>

      <div className="tab-body">
        {tab === "protection" ? (
          <>
            {view === "status" && (
              <>
                <StatusScreen paired={paired} />
                <hr className="divider" />
                {!paired && (
                  <button
                    className="button"
                    onClick={() => setView("choose")}
                  >
                    Pair this browser
                  </button>
                )}
              </>
            )}
            {view === "choose" && (
              <ChooseModeScreen
                onPickCode={() => setView("code")}
                onPickDirect={() => setView("direct")}
              />
            )}
            {view === "code" && (
              <CodePairingScreen
                onDone={() => setView("status")}
                onBack={() => setView("choose")}
              />
            )}
            {view === "direct" && (
              <DirectSignInScreen
                onDone={() => setView("status")}
                onBack={() => setView("choose")}
              />
            )}
          </>
        ) : (
          <SettingsScreen />
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 5: Update StatusScreen to reflect paired state**

```tsx
import type { PairedState } from "../shared/paired-state.js";

export function StatusScreen({ paired }: { paired: PairedState | null }) {
  return (
    <>
      <h1>You&apos;re protected</h1>
      <p>Gone Phishin&apos; is checking links in Gmail and Outlook.</p>
      <div className="status">
        {paired ? (
          <>Paired with <strong>{paired.label}</strong>.</>
        ) : (
          <>Anonymous mode. Pair below to share danger events with family or your own dashboard.</>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 6: Service worker: receive token from web app**

Append to `apps/extension/src/background/service-worker.ts`:

```ts
import { setPairedState } from "../shared/paired-state.js";

chrome.runtime.onMessageExternal.addListener((message, _sender, sendResponse) => {
  if (
    message &&
    typeof message === "object" &&
    message.type === "activate-with-token"
  ) {
    void setPairedState({
      token: message.token,
      circleId: message.circleId,
      label: message.label,
    }).then(() => sendResponse({ ok: true }));
    return true;
  }
  sendResponse({ ok: false });
  return false;
});
```

- [ ] **Step 7: Update API client to include the bearer token if paired**

Modify `apps/extension/src/background/api-client.ts` so `scanUrlsViaApi` reads the paired token and includes it as `Authorization: Bearer ...`. Also add an `eventLogViaApi` helper that posts danger events.

```ts
import type { ScanRequest, ScanResponse, ScanResult } from "@gonephishin/shared";
import { API_BASE_URL } from "../shared/env.js";
import { getPairedState } from "../shared/paired-state.js";

const TIMEOUT_MS = 3000;

export async function scanUrlsViaApi(urls: string[]): Promise<ScanResult[]> {
  if (urls.length === 0) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body: ScanRequest = { urls };
    const paired = await getPairedState();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (paired) headers["Authorization"] = `Bearer ${paired.token}`;
    const res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      headers,
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

export async function logEventViaApi(event: {
  url: string;
  threatType: string;
  action: "shown" | "dismissed" | "ignored_warning";
  sourceSite: string;
}): Promise<void> {
  const paired = await getPairedState();
  if (!paired) return; // anonymous mode — skip
  try {
    await fetch(`${API_BASE_URL}/api/events/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paired.token}`,
      },
      body: JSON.stringify(event),
    });
  } catch (err) {
    console.warn("[gonephishin] event log failed:", err);
  }
}
```

- [ ] **Step 8: Wire `warning-acknowledged` to logEventViaApi**

In `apps/extension/src/background/service-worker.ts`, extend the message listener to handle `warning-acknowledged`:

```ts
import { logEventViaApi, scanUrlsViaApi } from "./api-client.js";

// Inside chrome.runtime.onMessage.addListener…
if (message.type === "warning-acknowledged") {
  // The content script hands us URL + outcome; we infer threatType from the
  // most recent verdict cached for that URL.
  void getCachedVerdict(message.url).then((cached) => {
    void logEventViaApi({
      url: message.url,
      threatType: cached?.threatType ?? "unknown",
      action: message.outcome,
      sourceSite: hostFromUrl(message.url),
    });
  });
  return false;
}
```

Add a small helper `hostFromUrl` near the top of the file.

- [ ] **Step 9: Build the extension and commit**

```bash
cd /Users/ianbarrie/gonephisin
pnpm --filter @gonephishin/extension typecheck
VITE_API_BASE_URL=http://localhost:3000 pnpm --filter @gonephishin/extension build
git add apps/extension/src
git commit -m "feat(extension): wire pairing-code, direct sign-in, paired status, event logging"
```

---

## Task 17: End-to-end manual smoke test

A manual checklist. Run before declaring v0.1b done.

- [ ] **Step 1: Start the dev server**

```bash
pnpm --filter @gonephishin/web dev
```

- [ ] **Step 2: Reload the extension**

`chrome://extensions` → click 🔄 on Gone Phishin'.

- [ ] **Step 3: Test the marketing page**

Visit `http://localhost:3000`. Hero loads. Nav links work. "Sign in" leads to Clerk's themed widget.

- [ ] **Step 4: Test caregiver-paired flow**

1. Sign up with email A. You're redirected to `/dashboard`.
2. Add a circle named "Mom". Click into it.
3. Click "Generate pairing code". Six digits appear.
4. Open the extension popup. Click "Pair this browser" → "I have a code from family".
5. Type the six digits. The popup status switches to *"Paired with Mom"*.
6. Open Gmail. Send yourself an email with `https://paypa1.com/`. View it. Click the link. Click "Continue Anyway" on the warning modal.
7. Refresh `/circle/<id>` — the danger event should appear in the timeline with action "Senior continued anyway".

- [ ] **Step 5: Test self-managed direct sign-in flow**

1. Open `chrome://extensions`, copy the Gone Phishin' extension ID. Set `NEXT_PUBLIC_EXTENSION_ID` in `apps/web/.env.local`. Restart the dev server.
2. Open the extension, click "Pair this browser" → "This is for myself — sign in".
3. Click "Open sign-in". A new tab opens at `/extension/activate` (Clerk redirects to sign-in if you're not signed in).
4. Sign in. You land back on `/extension/activate`. It says "Connecting…" then "You're all set".
5. Pop back to the extension. Status updates to *"Paired with <your name>"*.
6. Click `/dashboard` from the marketing nav — you should see your own self-managed circle with you as the owner.

- [ ] **Step 6: Test settings**

1. Visit `/settings`. Active tokens list. Revoke one — extension switches back to anonymous.
2. Re-pair. Delete the circle. Token is auto-revoked; circle gone from `/dashboard`.

- [ ] **Step 7: Tag the milestone**

```bash
git tag -a v0.1b -m "v0.1b — full pairing + dashboard + marketing page wired end-to-end"
```

---

## Task 18: Vercel preview deploy + final test

- [ ] **Step 1: Push to GitHub if not already**

```bash
gh repo create gonephishin --private --source=. --remote=origin --push
```

- [ ] **Step 2: Trigger a preview deploy**

```bash
cd apps/web
vercel --yes
```

Note the preview URL.

- [ ] **Step 3: Update extension to point at the preview**

In `apps/extension/.env.local`:

```
VITE_API_BASE_URL=https://gonephishin-<hash>.vercel.app
```

Rebuild and reload extension. Re-run the smoke test from Task 17 against the deployed URL — pairing flow, direct sign-in, dashboard, event logging — should all work without your laptop running.

- [ ] **Step 4: Tag**

```bash
git tag -a v0.1 -m "v0.1 — production deploy on Vercel preview"
```

---

## Session 2 Done — what's working

- A new user can land on the marketing page, install the extension, sign up, pair via code OR direct sign-in, and watch their dashboard fill with real danger events.
- The extension reports events via Bearer token; the dashboard reads them with proper ownership checks.
- Rate-limiting, session auth, and ownership checks all enforced server-side.
- Whole flow runs against a Vercel preview deploy with Clerk + Neon + Safe Browsing all live.

Next plans will tackle v0.2 (Yahoo Mail support, email-invite pairing, Resend alerts, multi-member circles, the per-email banner UX option C).
