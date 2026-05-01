CREATE TABLE IF NOT EXISTS "rate_limit_buckets" (
	"bucket_key" text PRIMARY KEY NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scan_cache" (
	"url_hash" text PRIMARY KEY NOT NULL,
	"verdict" text NOT NULL,
	"threat_type" text,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
