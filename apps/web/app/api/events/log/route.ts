import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { dangerEvents } from "@/lib/db/schema";
import { verifyExtensionToken } from "@/lib/auth/extension-token";

export const runtime = "nodejs";

interface LogBody {
  url: string;
  threatType: string;
  action: "shown" | "dismissed" | "ignored_warning";
  sourceSite: string;
}

export async function POST(request: Request): Promise<Response> {
  const auth = await verifyExtensionToken(request.headers.get("authorization"));
  // Unauthed events are silently dropped (anonymous mode).
  if (!auth) return NextResponse.json({ ok: true });

  const body = (await request.json()) as LogBody;
  if (!body.url || !body.threatType || !body.action || !body.sourceSite) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  let domain = "";
  try {
    domain = new URL(body.url).hostname;
  } catch {
    return NextResponse.json({ error: "bad url" }, { status: 400 });
  }

  await db.insert(dangerEvents).values({
    circleId: auth.circleId,
    url: body.url,
    domain,
    threatType: body.threatType,
    action: body.action,
    sourceSite: body.sourceSite,
  });
  return NextResponse.json({ ok: true });
}
