import Link from "next/link";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles, dangerEvents } from "@/lib/db/schema";
import { createCircleAction } from "./actions";

export const dynamic = "force-dynamic";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default async function DashboardPage() {
  const user = await getOrCreateCurrentUser();
  const myCircles = await db
    .select()
    .from(circles)
    .where(eq(circles.ownerId, user.id));

  const myCircleIds = myCircles.map((c) => c.id);
  const oneWeekAgo = new Date(Date.now() - SEVEN_DAYS_MS);

  // Per-circle counts for the family card sidebar.
  const perCircleCounts = myCircleIds.length
    ? await db
        .select({
          circleId: dangerEvents.circleId,
          count: sql<number>`count(*)::int`,
        })
        .from(dangerEvents)
        .where(
          and(
            gte(dangerEvents.createdAt, oneWeekAgo),
            inArray(dangerEvents.circleId, myCircleIds),
          ),
        )
        .groupBy(dangerEvents.circleId)
    : [];

  const countByCircle = new Map(
    perCircleCounts
      .filter(
        (c): c is { circleId: string; count: number } => c.circleId !== null,
      )
      .map((c) => [c.circleId, c.count]),
  );

  const totalThreats = perCircleCounts.reduce((sum, c) => sum + c.count, 0);

  // Top 5 recent threats across all of the user's circles.
  const recentThreats = myCircleIds.length
    ? await db
        .select({
          id: dangerEvents.id,
          domain: dangerEvents.domain,
          url: dangerEvents.url,
          threatType: dangerEvents.threatType,
          createdAt: dangerEvents.createdAt,
          circleId: dangerEvents.circleId,
        })
        .from(dangerEvents)
        .where(inArray(dangerEvents.circleId, myCircleIds))
        .orderBy(desc(dangerEvents.createdAt))
        .limit(5)
    : [];

  const circleLabelById = new Map(myCircles.map((c) => [c.id, c.label]));
  const greetingName = (user.name ?? user.email.split("@")[0] ?? "there")
    .split(" ")[0]!;

  return (
    <>
      <div className="greeting">
        <div>
          <h1>{greetingForTimeOfDay()}, {greetingName}.</h1>
          <p className="sub">
            Here&apos;s what Gone Phishin&apos; caught for you and your family
            this week.
          </p>
        </div>
        <span className="status-pill">
          <span className="dot" />
          Extension active · Watching {myCircles.length}{" "}
          {myCircles.length === 1 ? "circle" : "circles"}
        </span>
      </div>

      <div className="app-stats">
        <div className="app-stat">
          <div className="label">Threats stopped</div>
          <div className="num">{totalThreats}</div>
          <div className="delta">Last 7 days</div>
        </div>
        <div className="app-stat">
          <div className="label">Family members</div>
          <div className="num">{myCircles.length}</div>
          <div className="delta">
            {myCircles.length === 0
              ? "Add your first circle"
              : `${myCircles.length} ${myCircles.length === 1 ? "circle" : "circles"} watched`}
          </div>
        </div>
        <div className="app-stat">
          <div className="label">Account safety</div>
          <div className="num" style={{ color: "#6ee7b7" }}>
            A+
          </div>
          <div className="delta up">All checks passing</div>
        </div>
        <div className="app-stat">
          <div className="label">Plan</div>
          <div className="num">Free</div>
          <div className="delta">Forever</div>
        </div>
      </div>

      <div className="app-grid">
        {/* Recent threats */}
        <section className="app-card">
          <div className="head">
            <div>
              <h2>Recent threats</h2>
              <div className="sub">Last events across your family circle</div>
            </div>
            {recentThreats.length > 0 && (
              <span className="link" aria-hidden="true">
                {recentThreats.length} shown
              </span>
            )}
          </div>
          {recentThreats.length === 0 ? (
            <div className="empty">
              No threats yet. When something dangerous slips into one of your
              inboxes, it&apos;ll show up here.
            </div>
          ) : (
            recentThreats.map((t) => (
              <Link
                key={t.id}
                href={`/circle/${t.circleId}`}
                className="threat-row"
                style={{ textDecoration: "none" }}
              >
                <div className={`threat-icon ${threatTone(t.threatType)}`}>
                  <ShieldAlertIcon />
                </div>
                <div className="threat-info">
                  <div className="top">
                    <span className="from">
                      {prettyThreatType(t.threatType)}
                    </span>
                    {t.circleId &&
                      circleLabelById.get(t.circleId) && (
                        <span className="for">
                          · caught for {circleLabelById.get(t.circleId)}
                        </span>
                      )}
                  </div>
                  <div className="url">{t.domain}</div>
                </div>
                <span className="threat-time">{timeAgo(t.createdAt)}</span>
              </Link>
            ))
          )}
        </section>

        {/* Family circle */}
        <section className="app-card">
          <div className="head">
            <div>
              <h2>Your circles</h2>
              <div className="sub">One row per browser you protect</div>
            </div>
          </div>

          {myCircles.length === 0 ? (
            <div className="empty">
              No circles yet. Add one for yourself or for a family member
              below — you can have as many as you like.
            </div>
          ) : (
            myCircles.map((c) => (
              <Link
                key={c.id}
                href={`/circle/${c.id}`}
                className="family-row linked"
                style={{ textDecoration: "none" }}
              >
                <span className="family-avatar">
                  {initials(c.label)}
                </span>
                <div className="family-info">
                  <div className="nm">
                    {c.label}{" "}
                    <span className="role">
                      ·{" "}
                      {c.mode === "self" ? "Yourself" : "Family"}
                    </span>
                  </div>
                  <div className="meta">
                    <span className="stopped">
                      {countByCircle.get(c.id) ?? 0} threats stopped
                    </span>{" "}
                    this week
                  </div>
                </div>
                <span className="app-pill active">Active</span>
              </Link>
            ))
          )}

          <form action={createCircleAction} className="circle-add">
            <div className="circle-add-row">
              <input
                name="label"
                className="app-input"
                placeholder='Name this circle (e.g. "Me", "Mom", "Dad")'
                required
                aria-label="Circle name"
              />
              <button type="submit" className="app-btn app-btn-primary">
                Add circle
              </button>
            </div>
            <fieldset className="circle-add-modes">
              <legend className="sr-only">Who is this for?</legend>
              <label className="mode-pick">
                <input
                  type="radio"
                  name="mode"
                  value="self"
                  defaultChecked
                />
                <span className="pick-body">
                  <span className="pick-title">For me</span>
                  <span className="pick-sub">
                    No code needed — just click &ldquo;This is my browser&rdquo;
                    in the extension popup.
                  </span>
                </span>
              </label>
              <label className="mode-pick">
                <input type="radio" name="mode" value="caregiver" />
                <span className="pick-body">
                  <span className="pick-title">For a family member</span>
                  <span className="pick-sub">
                    Generates a 6-digit code. Read it to them on the phone so
                    their browser pairs to your dashboard.
                  </span>
                </span>
              </label>
            </fieldset>
          </form>
        </section>
      </div>
    </>
  );
}

function threatTone(threatType: string): "" | "warn" | "safe" {
  if (threatType === "sketchy" || threatType.startsWith("heuristic_")) {
    return "warn";
  }
  return "";
}

function prettyThreatType(t: string): string {
  if (t.startsWith("sb_")) {
    return "Phishing or malware page";
  }
  if (t.startsWith("heuristic_typosquat")) return "Look-alike domain";
  if (t.startsWith("heuristic_idn_homoglyph")) return "Suspicious lookalike";
  if (t.startsWith("heuristic_ip_address")) return "Suspicious IP-only link";
  if (t.startsWith("heuristic_excessive_subdomains"))
    return "Suspicious link structure";
  if (t.startsWith("heuristic_suspicious_tld")) return "Suspicious TLD";
  if (t.startsWith("heuristic_brand_mismatch"))
    return "Brand-impersonation link";
  if (t.startsWith("heuristic_")) return "Suspicious link";
  if (t === "dangerous") return "Phishing or malware page";
  if (t === "sketchy") return "Suspicious link";
  return "Threat caught";
}

function greetingForTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function timeAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

function initials(label: string): string {
  const parts = label.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "•";
}

function ShieldAlertIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
