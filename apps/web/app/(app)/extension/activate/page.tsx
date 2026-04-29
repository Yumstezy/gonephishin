"use client";

import { useEffect, useState } from "react";

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

interface ChromeWindow {
  chrome?: {
    runtime?: {
      sendMessage?: (
        extensionId: string,
        message: unknown,
        callback: (response: { ok?: boolean } | undefined) => void,
      ) => void;
    };
  };
}

export default function ActivatePage() {
  const [status, setStatus] = useState<
    "starting" | "minting" | "sending" | "done" | "error"
  >("starting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void run();

    async function run() {
      if (!EXTENSION_ID) {
        setStatus("error");
        setError(
          "NEXT_PUBLIC_EXTENSION_ID is not set. Open the extension popup, copy its ID from chrome://extensions, and add it to .env.local.",
        );
        return;
      }
      try {
        setStatus("minting");
        const res = await fetch("/api/pair/direct", { method: "POST" });
        if (!res.ok) throw new Error(`mint failed: ${res.status}`);
        const data = (await res.json()) as {
          token: string;
          circleId: string;
          label: string;
        };

        setStatus("sending");
        const chromeApi = (globalThis as unknown as ChromeWindow).chrome;
        if (!chromeApi?.runtime?.sendMessage) {
          throw new Error(
            "Chrome extension API not available. Make sure you're in Chrome with the Gone Phishin' extension installed.",
          );
        }
        await new Promise<void>((resolve, reject) => {
          chromeApi.runtime!.sendMessage!(
            EXTENSION_ID,
            { type: "activate-with-token", ...data },
            (response) => {
              if (response?.ok) resolve();
              else reject(new Error("extension did not acknowledge"));
            },
          );
        });
        setStatus("done");
      } catch (e) {
        setStatus("error");
        setError((e as Error).message);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      {status === "done" ? (
        <>
          <h1 className="mb-2 text-2xl font-semibold">You&apos;re all set</h1>
          <p className="text-muted-foreground">
            Gone Phishin&apos; is now connected. You can close this tab.
          </p>
        </>
      ) : status === "error" ? (
        <>
          <h1 className="mb-2 text-2xl font-semibold text-destructive">
            Sign-in didn&apos;t finish
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-semibold">Connecting…</h1>
          <p className="text-muted-foreground">
            {status === "minting" && "Generating your secure code…"}
            {status === "sending" && "Sending it to your browser…"}
            {status === "starting" && "Starting…"}
          </p>
        </>
      )}
    </div>
  );
}
