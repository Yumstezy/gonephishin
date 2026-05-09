"use client";

import { deleteCircleAction } from "@/app/(app)/settings/actions";

/**
 * Client-side wrapper around the deleteCircleAction server action so we can
 * show a native confirm() before submitting. Native confirm is rough UX,
 * but for a destructive action that wipes a circle's full event log, the
 * extra friction is the point. Replace with a fancier modal once we have
 * a pattern for it across the dashboard.
 */
export function DeleteCircleButton({
  circleId,
  circleLabel,
}: {
  circleId: string;
  circleLabel: string;
}) {
  return (
    <form
      action={deleteCircleAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          `Delete the "${circleLabel}" circle?\n\n` +
            "This permanently removes its threat history and revokes any " +
            "paired browsers. This can't be undone.",
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="circleId" value={circleId} />
      <input type="hidden" name="redirectTo" value="/dashboard" />
      <button type="submit" className="app-btn app-btn-danger">
        Delete this circle
      </button>
    </form>
  );
}
