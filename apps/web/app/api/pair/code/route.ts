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

  // Invalidate the oldest active code if we're at the cap
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
