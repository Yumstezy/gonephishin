import { useState } from "react";
import { API_BASE_URL } from "../shared/env.js";
import { setPairedState } from "../shared/paired-state.js";

export function CodePairingScreen({
  onDone,
  onBack,
}: {
  onDone: () => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pair/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setError("That code didn't work. Ask your family for a new one.");
        return;
      }
      const data = (await res.json()) as {
        token: string;
        circleId: string;
        label: string;
      };
      await setPairedState({
        token: data.token,
        circleId: data.circleId,
        label: data.label,
      });
      onDone();
    } catch {
      setError("Couldn't reach the server. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Type the code from your family</h1>
      <p>They&apos;ll have read it to you over the phone — six digits.</p>
      <form onSubmit={submit} className="buttons">
        <input
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          autoFocus
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          style={{
            fontSize: 28,
            letterSpacing: "0.4em",
            textAlign: "center",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />
        <button
          type="submit"
          className="button"
          disabled={loading || code.length !== 6}
        >
          {loading ? "Checking…" : "Confirm"}
        </button>
        <button type="button" className="button" onClick={onBack}>
          Back
        </button>
      </form>
      {error && (
        <p className="note" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}
    </>
  );
}
