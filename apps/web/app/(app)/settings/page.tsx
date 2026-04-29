import { eq, inArray, isNull } from "drizzle-orm";
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
  const myActiveTokens = myCircleIds.length
    ? await db
        .select()
        .from(extensionTokens)
        .where(
          inArray(extensionTokens.circleId, myCircleIds),
        )
        .then((rows) => rows.filter((t) => !t.revokedAt))
    : [];

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
        {myCircles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No circles yet — add one from the dashboard.
          </p>
        ) : (
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
        )}
      </section>
    </div>
  );
}
