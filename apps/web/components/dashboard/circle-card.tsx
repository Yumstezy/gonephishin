import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelativeTimeCard } from "@/components/ui/relative-time-card-1";

export interface CircleCardProps {
  id: string;
  label: string;
  mode: "caregiver" | "self";
  weeklyDangerCount: number;
  lastActivity: Date | null;
}

export function CircleCard(props: CircleCardProps) {
  return (
    <Link href={`/circle/${props.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{props.label}</span>
            {props.weeklyDangerCount > 0 && (
              <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                {props.weeklyDangerCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {props.lastActivity ? (
            <RelativeTimeCard date={props.lastActivity.getTime()} side="top">
              <span>Last activity {timeAgo(props.lastActivity)}</span>
            </RelativeTimeCard>
          ) : (
            <span>No activity yet — pair the extension to start.</span>
          )}
          <div className="mt-1 text-xs uppercase tracking-wide">
            {props.mode === "self" ? "Self-managed" : "Family-paired"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function timeAgo(d: Date): string {
  const ms = Date.now() - d.getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
