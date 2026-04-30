import type { PairedState } from "../shared/paired-state.js";

export function StatusScreen({ paired }: { paired: PairedState | null }) {
  return (
    <>
      <h1>You&apos;re protected</h1>
      <p>Gone Phishin&apos; is checking links in Gmail and Outlook.</p>
      <div className="status">
        {paired ? (
          <>
            Paired with <strong>{paired.label}</strong>.
          </>
        ) : (
          <>
            Anonymous mode. Pair below to share danger events with family or
            your own dashboard.
          </>
        )}
      </div>
    </>
  );
}
