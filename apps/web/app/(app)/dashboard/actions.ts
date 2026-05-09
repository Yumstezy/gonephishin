"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, desc, eq, gt } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles } from "@/lib/db/schema";

const DUPLICATE_WINDOW_MS = 60_000;

export async function createCircleAction(formData: FormData): Promise<void> {
  const label = String(formData.get("label") ?? "").trim();
  const modeInput = String(formData.get("mode") ?? "self");
  const mode = modeInput === "caregiver" ? "caregiver" : "self";
  if (!label) return;

  const user = await getOrCreateCurrentUser();

  // Idempotency guard: if the user just created a circle with the exact same
  // (label, mode) within the last minute, treat this submission as a
  // double-submit and redirect to the existing one. Cheap, handles the
  // refresh / fast-double-click case without needing a request-id round-trip.
  const sinceTs = new Date(Date.now() - DUPLICATE_WINDOW_MS);
  const recent = await db
    .select()
    .from(circles)
    .where(
      and(
        eq(circles.ownerId, user.id),
        eq(circles.label, label),
        eq(circles.mode, mode),
        gt(circles.createdAt, sinceTs),
      ),
    )
    .orderBy(desc(circles.createdAt))
    .limit(1);
  if (recent[0]) {
    redirect(`/circle/${recent[0].id}`);
  }

  const [row] = await db
    .insert(circles)
    .values({ ownerId: user.id, label, mode })
    .returning();
  if (!row) return;
  revalidatePath("/dashboard");
  redirect(`/circle/${row.id}`);
}
