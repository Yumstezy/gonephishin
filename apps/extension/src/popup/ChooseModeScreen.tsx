export function ChooseModeScreen({
  onPickCode,
  onPickDirect,
}: {
  onPickCode: () => void;
  onPickDirect: () => void;
}) {
  return (
    <>
      <h1>Connect this browser</h1>
      <p>Both options keep the warnings working. Pick whichever fits.</p>
      <div className="mode-cards">
        <button className="mode-card" onClick={onPickDirect}>
          <span className="mode-title">This is my browser</span>
          <span className="mode-sub">
            Sign in with your own account. Threats blocked here show up in
            your dashboard.
          </span>
          <span className="mode-tag">Most common</span>
        </button>
        <button className="mode-card" onClick={onPickCode}>
          <span className="mode-title">I&apos;m setting this up for someone</span>
          <span className="mode-sub">
            They gave you a 6-digit code over the phone. Enter it here so
            their dashboard sees this browser&apos;s threats.
          </span>
        </button>
      </div>
    </>
  );
}
