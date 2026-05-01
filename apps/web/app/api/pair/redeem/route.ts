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
