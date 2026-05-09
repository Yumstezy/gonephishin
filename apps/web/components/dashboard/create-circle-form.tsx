"use client";

import { useFormStatus } from "react-dom";
import { createCircleAction } from "@/app/(app)/dashboard/actions";

/**
 * Add-circle form on /dashboard. Wrapped in a client component so we can
 * hook useFormStatus and disable the submit button while the server action
 * is in flight — without that, fast clicks (or pressing Enter twice in
 * the input) racethrough and create duplicates. Belt-and-suspenders with
 * the server-side dedup window.
 */
export function CreateCircleForm() {
  return (
    <form action={createCircleAction} className="circle-add">
      <div className="circle-add-row">
        <input
          name="label"
          className="app-input"
          placeholder='Name this circle (e.g. "Me", "Mom", "Dad")'
          required
          aria-label="Circle name"
        />
        <SubmitButton />
      </div>
      <fieldset className="circle-add-modes">
        <legend className="sr-only">Who is this for?</legend>
        <label className="mode-pick">
          <input type="radio" name="mode" value="self" defaultChecked />
          <span className="pick-body">
            <span className="pick-title">For me</span>
            <span className="pick-sub">
              No code needed — just click &ldquo;This is my browser&rdquo; in
              the extension popup.
            </span>
          </span>
        </label>
        <label className="mode-pick">
          <input type="radio" name="mode" value="caregiver" />
          <span className="pick-body">
            <span className="pick-title">For a family member</span>
            <span className="pick-sub">
              Generates a 6-digit code. Read it to them on the phone so their
              browser pairs to your dashboard.
            </span>
          </span>
        </label>
      </fieldset>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="app-btn app-btn-primary"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Adding…" : "Add circle"}
    </button>
  );
}
