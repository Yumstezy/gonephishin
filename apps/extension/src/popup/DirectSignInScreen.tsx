import { useEffect } from "react";
import { API_BASE_URL } from "../shared/env.js";
import { getPairedState } from "../shared/paired-state.js";

export function DirectSignInScreen({
  onDone,
  onBack,
}: {
  onDone: () => void;
  onBack: () => void;
}) {
  // Polls paired-state every 2s; service worker writes it when the activate
  // page sends the token via runtime.sendMessage.
  useEffect(() => {
    const id = setInterval(async () => {
      if (await getPairedState()) onDone();
    }, 2000);
    return () => clearInterval(id);
  }, [onDone]);

  function open() {
    void chrome.tabs.create({ url: `${API_BASE_URL}/extension/activate` });
  }

  return (
    <>
      <h1>Sign in for yourself</h1>
      <p>
        We&apos;ll open a sign-in page in a new tab. Once you&apos;re signed
        in, come back here.
      </p>
      <div className="buttons">
        <button className="button" onClick={open}>
          Open sign-in
        </button>
        <button className="button" onClick={onBack}>
          Back
        </button>
      </div>
    </>
  );
}
