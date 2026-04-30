export function ChooseModeScreen({
  onPickCode,
  onPickDirect,
}: {
  onPickCode: () => void;
  onPickDirect: () => void;
}) {
  return (
    <>
      <h1>How will you use Gone Phishin&apos;?</h1>
      <p>Pick one. You can change later.</p>
      <div className="buttons">
        <button className="button" onClick={onPickCode}>
          I have a code from family
        </button>
        <button className="button" onClick={onPickDirect}>
          This is for myself — sign in
        </button>
      </div>
    </>
  );
}
