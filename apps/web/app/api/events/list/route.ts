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
