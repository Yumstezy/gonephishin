"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PairingCodeDisplay({ circleId }: { circleId: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pair/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId }),
      });
      if (!res.ok) throw new Error(`got ${res.status}`);
      const data = (await res.json()) as { code: string; expiresAt: string };
      setCode(data.code);
      setExpiresAt(new Date(data.expiresAt));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-2 text-lg font-semibold">Pairing code</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Read this code to your family member over the phone. They type it into
        the Gone Phishin&apos; extension on their browser.
      </p>
      {code ? (
        <div className="space-y-2">
          <div className="font-mono text-4xl tracking-[0.4em] text-primary">
            {code}
          </div>
          {expiresAt && (
            <p className="text-xs text-muted-foreground">
              Expires {expiresAt.toLocaleTimeString()}
            </p>
          )}
          <Button variant="outline" onClick={generate} disabled={loading}>
            {loading ? "Generating…" : "New code"}
          </Button>
        </div>
      ) : (
        <Button onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Generate pairing code"}
        </Button>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
