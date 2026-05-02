import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { PairingCodeDisplay } from "@/components/dashboard/pairing-code-display";
import { db } from "@/lib/db/client";
import { circles, dangerEvents } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function CirclePage(props: {
  params: Promise<{ id: string }>;
}) {
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
    <>
      <div className="circle-header">
        <div>
          <h1>{circle.label}</h1>
          <p className="sub">
            {circle.mode === "self" ? "Yourself" : "Family member"} ·{" "}
            {events.length} {events.length === 1 ? "event" : "events"} on
            record
          </p>
        </div>
        <span className="status-pill">
          <span className="dot" />
          Active
        </span>
      </div>

      <div className="app-grid">
        <section className="app-card">
          <div className="head">
            <div>
              <h2>Recent activity</h2>
              <div className="sub">
                Every threat blocked for {circle.label}, newest first.
              </div>
            </div>
          </div>
          {events.length === 0 ? (
            <div className="empty">
              No danger events yet. Once the extension sees a sketchy or
              dangerous link, it will appear here.
            </div>
          ) : (
            events.map((e) => (
              <div key={e.id} className="threat-row">
                <div className={`threat-icon ${threatTone(e.threatType)}`}>
                  <ShieldAlertIcon />
                </div>
                <div className="threat-info">
                  <div className="top">
                    <span className="from">
                      {prettyThreatType(e.threatType)}
                    </span>
                    <span className="for">· {prettyAction(e.action)}</span>
                  </div>
                  <div className="url">{e.domain}</div>
                </div>
                <span className="threat-time">{timeAgo(e.createdAt)}</span>
              </div>
            ))
          )}
        </section>

        <section className="app-card" style={{ alignSelf: "start" }}>
          <div className="head">
            <div>
              <h2>{circle.mode === "caregiver" ? "Pair their browser" : "Connect this browser"}</h2>
              <div className="sub">
                {circle.mode === "caregiver"
                  ? "Steps to set up their computer over the phone."
                  : "How to point your browser at this circle."}
              </div>
            </div>
          </div>
          {circle.mode === "caregiver" ? (
            <>
              <ol className="setup-steps">
                <li>
                  Have <strong>{circle.label}</strong> install the Gone
                  Phishin&apos; extension on <em>their</em> computer.
                </li>
                <li>
                  Tell them to click the fish icon in their browser toolbar,
                  then <strong>Connect to my dashboard</strong> →{" "}
                  <strong>I&apos;m setting this up for someone</strong>.
                </li>
                <li>Read them the code below.</li>
              </ol>
              <PairingCodeDisplay circleId={circle.id} />
            </>
          ) : (
            <ol className="setup-steps">
              <li>
                Install the Gone Phishin&apos; extension on this browser if
                you haven&apos;t yet.
              </li>
              <li>
                Click the fish icon in the toolbar →{" "}
                <strong>Connect to my dashboard</strong> →{" "}
                <strong>This is my browser</strong>.
              </li>
              <li>
                Sign in with the same email you used here. Threats stopped on
                this browser will appear in this circle&apos;s activity log.
              </li>
            </ol>
          )}
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
  if (t.startsWith("sb_")) return "Phishing or malware page";
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

function prettyAction(a: string): string {
  if (a === "shown") return "Warning shown";
  if (a === "dismissed") return "Went back safely";
  if (a === "ignored_warning") return "Continued anyway";
  return a;
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
