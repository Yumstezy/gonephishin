import { auth, currentUser as currentClerkUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, type UserRow } from "../db/schema";

/**
 * Resolve the signed-in Clerk session to a row in our `users` table.
 * Auto-creates the row on first sign-in. Throws if no session.
 */
export async function getOrCreateCurrentUser(): Promise<UserRow> {
  const { userId } = await auth();
  if (!userId) throw new Error("not signed in");

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);
  if (existing[0]) return existing[0];

  const clerkUser = await currentClerkUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    null;

  const [created] = await db
    .insert(users)
    .values({ clerkUserId: userId, email, name })
    .returning();
  if (!created) throw new Error("failed to create user");
  return created;
}
