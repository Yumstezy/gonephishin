import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { EventRow } from "@/components/dashboard/event-row";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{circle.label}</h1>
        <p className="text-muted-foreground">
          {circle.mode === "self" ? "Self-managed" : "Family-paired"} circle
        </p>
      </div>

      {circle.mode === "caregiver" && (
        <PairingCodeDisplay circleId={circle.id} />
      )}

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
                action={
                  e.action as "shown" | "dismissed" | "ignored_warning"
                }
                sourceSite={e.sourceSite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
