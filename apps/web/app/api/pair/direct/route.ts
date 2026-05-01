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
