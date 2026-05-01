"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles, extensionTokens } from "@/lib/db/schema";

export async function revokeTokenAction(formData: FormData): Promise<void> {
  const tokenId = String(formData.get("tokenId") ?? "");
  if (!tokenId) return;
  const user = await getOrCreateCurrentUser();

  const myCircleIds = (
    await db.select().from(circles).where(eq(circles.ownerId, user.id))
  ).map((c) => c.id);
  const matching = await db
    .select()
    .from(extensionTokens)
    .where(eq(extensionTokens.id, tokenId))
    .limit(1);
  if (!matching[0] || !myCircleIds.includes(matching[0].circleId)) return;

  await db
    .update(extensionTokens)
    .set({ revokedAt: new Date() })
    .where(eq(extensionTokens.id, tokenId));
  revalidatePath("/settings");
}

export async function deleteCircleAction(formData: FormData): Promise<void> {
  const circleId = String(formData.get("circleId") ?? "");
  if (!circleId) return;
  const user = await getOrCreateCurrentUser();
  await db
    .delete(circles)
    .where(and(eq(circles.id, circleId), eq(circles.ownerId, user.id)));
  await db
    .update(extensionTokens)
    .set({ revokedAt: new Date() })
    .where(eq(extensionTokens.circleId, circleId));
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}
