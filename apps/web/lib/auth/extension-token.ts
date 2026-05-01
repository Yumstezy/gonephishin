import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/client";
import { extensionTokens, type ExtensionTokenRow } from "../db/schema";

/**
 * Generate a fresh bearer token. The plaintext is returned ONCE; only the
 * sha256 hash is stored. Caller awaits `row` to confirm DB insert succeeded.
 */
export function mintTokenForCircle(circleId: string): {
  plaintext: string;
  row: Promise<ExtensionTokenRow>;
} {
  const plaintext = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(plaintext).digest("hex");
  const row = db
    .insert(extensionTokens)
    .values({ circleId, tokenHash })
    .returning()
    .then((rows) => {
      const r = rows[0];
      if (!r) throw new Error("failed to insert extension_token");
      return r;
    });
  return { plaintext, row };
}

/**
 * Look up a token by Authorization header. Returns null if missing,
 * malformed, or revoked.
 */
export async function verifyExtensionToken(
  authorizationHeader: string | null,
): Promise<{ tokenId: string; circleId: string } | null> {
  if (!authorizationHeader) return null;
  const match = /^Bearer (.+)$/.exec(authorizationHeader);
  if (!match) return null;
  const plaintext = match[1]!;
  const tokenHash = createHash("sha256").update(plaintext).digest("hex");

  const rows = await db
    .select()
    .from(extensionTokens)
    .where(
      and(
        eq(extensionTokens.tokenHash, tokenHash),
        isNull(extensionTokens.revokedAt),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  // Bump last_seen — best-effort, don't await.
  void db
    .update(extensionTokens)
    .set({ lastSeenAt: new Date() })
    .where(eq(extensionTokens.id, row.id));

  return { tokenId: row.id, circleId: row.circleId };
}
