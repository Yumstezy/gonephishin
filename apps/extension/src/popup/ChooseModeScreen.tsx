export function ChooseModeScreen() {
  return (
    <>
      <h1>How will you use Gone Phishin&apos;?</h1>
      <p>Pick one. Both options arrive in the next update.</p>
      <div className="buttons">
        <button className="button" disabled>
          I have a code from family
        </button>
        <button className="button" disabled>
          This is for myself — sign in
        </button>
      </div>
      <p className="note">
        For now, the extension protects you in anonymous mode without any
        account.
      </p>
    </>
  );
}
