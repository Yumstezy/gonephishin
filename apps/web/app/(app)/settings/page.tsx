import { eq, inArray } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
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
  const myActiveTokens = myCircleIds.length
    ? await db
        .select()
        .from(extensionTokens)
        .where(inArray(extensionTokens.circleId, myCircleIds))
        .then((rows) => rows.filter((t) => !t.revokedAt))
    : [];

  return (
    <>
      <div className="circle-header">
        <div>
          <h1>Settings</h1>
          <p className="sub">
            Signed in as <strong>{user.email}</strong>
          </p>
        </div>
      </div>

      <section className="settings-section">
        <h2>Active extensions</h2>
        <p className="desc">
          Each row is a browser where Gone Phishin&apos; is paired to one of
          your circles. Revoke if a device is lost or you want to re-pair.
        </p>
        <div className="app-card">
          {myActiveTokens.length === 0 ? (
            <div className="empty">
              No active paired extensions. Generate a pairing code from a
              circle&apos;s page to set one up.
            </div>
          ) : (
            <div className="settings-list">
              {myActiveTokens.map((t) => (
                <div key={t.id} className="settings-list-item">
                  <div className="info">
                    <div className="nm">Paired browser</div>
                    <div className="meta">
                      Last seen{" "}
                      {t.lastSeenAt
                        ? t.lastSeenAt.toLocaleString()
                        : "never"}
                    </div>
                  </div>
                  <form action={revokeTokenAction}>
                    <input type="hidden" name="tokenId" value={t.id} />
                    <button type="submit" className="app-btn app-btn-danger">
                      Revoke
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="settings-section">
        <h2>Circles</h2>
        <p className="desc">
          Deleting a circle revokes any paired extensions and removes the
          danger event history. This can&apos;t be undone.
        </p>
        <div className="app-card">
          {myCircles.length === 0 ? (
            <div className="empty">
              No circles yet — add one from the dashboard.
            </div>
          ) : (
            <div className="settings-list">
              {myCircles.map((c) => (
                <div key={c.id} className="settings-list-item">
                  <div className="info">
                    <div className="nm">{c.label}</div>
                    <div className="meta">
                      {c.mode === "self" ? "Self-managed" : "Family circle"}
                    </div>
                  </div>
                  <form action={deleteCircleAction}>
                    <input type="hidden" name="circleId" value={c.id} />
                    <button type="submit" className="app-btn app-btn-danger">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
