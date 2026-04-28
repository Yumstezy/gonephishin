import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Pull it with `vercel env pull` or copy from .env.example.",
  );
}

// `prepare: false` is required for the Neon serverless pooler.
const client = postgres(connectionString, { prepare: false, max: 5 });
export const db = drizzle(client, { schema });
