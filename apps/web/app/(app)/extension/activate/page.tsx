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

  if (status === "done") {
    return (
      <div className="activate-card">
        <span className="icon success" aria-hidden="true">
          <CheckIcon />
        </span>
        <h1>You&apos;re all set</h1>
        <p>Gone Phishin&apos; is now connected. You can close this tab.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="activate-card">
        <span className="icon error" aria-hidden="true">
          <AlertIcon />
        </span>
        <h1>Sign-in didn&apos;t finish</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="activate-card">
      <span className="icon" aria-hidden="true">
        <SpinnerIcon />
      </span>
      <h1>Connecting…</h1>
      <p>
        {status === "minting" && "Generating your secure code…"}
        {status === "sending" && "Sending it to your browser…"}
        {status === "starting" && "Starting…"}
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
