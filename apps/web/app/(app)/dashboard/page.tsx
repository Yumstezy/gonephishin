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

  const byCircle = new Map(
    counts
      .filter((c): c is typeof c & { circleId: string } => c.circleId !== null)
      .map((c) => [c.circleId, c]),
  );

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
