import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || "walk_business",
      user: process.env.DB_USER || "walk_app",
      password: process.env.DB_PASS || "Wb@2026!Secure",
    });
  }
  return pool;
}
