import { RelativeTimeCard } from "@/components/ui/relative-time-card-1";

export interface EventRowProps {
  createdAt: Date;
  threatType: string;
  domain: string;
  action: "shown" | "dismissed" | "ignored_warning";
  sourceSite: string;
}

const ACTION_COPY: Record<
  EventRowProps["action"],
  { label: string; tone: "ok" | "warn" | "bad" }
> = {
  shown: { label: "Warning shown", tone: "warn" },
  dismissed: { label: "Senior went back ✓", tone: "ok" },
  ignored_warning: { label: "Senior continued anyway", tone: "bad" },
};

export function EventRow(props: EventRowProps) {
  const ac = ACTION_COPY[props.action];
  const toneClass =
    ac.tone === "ok"
      ? "text-emerald-700 bg-emerald-50"
      : ac.tone === "warn"
        ? "text-amber-700 bg-amber-50"
        : "text-rose-700 bg-rose-50";

  return (
    <div className="grid grid-cols-12 gap-4 items-center rounded-lg border border-border p-4">
      <div className="col-span-2 text-sm text-muted-foreground">
        <RelativeTimeCard date={props.createdAt.getTime()} side="top">
          <time dateTime={props.createdAt.toISOString()}>
            {props.createdAt.toLocaleDateString()}
          </time>
        </RelativeTimeCard>
      </div>
      <div className="col-span-3 text-sm font-medium">{props.threatType}</div>
      <div className="col-span-4 text-sm font-mono truncate">{props.domain}</div>
      <div className="col-span-2 text-xs uppercase text-muted-foreground">
        {props.sourceSite}
      </div>
      <div className="col-span-1">
        <span className={`text-xs rounded-full px-2 py-0.5 ${toneClass}`}>
          {ac.label}
        </span>
      </div>
    </div>
  );
}
