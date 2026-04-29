"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import { circles } from "@/lib/db/schema";

export async function createCircleAction(formData: FormData): Promise<void> {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;

  const user = await getOrCreateCurrentUser();
  const [row] = await db
    .insert(circles)
    .values({ ownerId: user.id, label, mode: "caregiver" })
    .returning();
  if (!row) return;
  revalidatePath("/dashboard");
  redirect(`/circle/${row.id}`);
}
