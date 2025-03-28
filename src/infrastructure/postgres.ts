import { PoolConfig, Pool } from "pg";
import { logger } from "../utils/logger";

const poolConfig: PoolConfig = {
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.POSTGRES_HOST || "localhost",
  database: "admin",
  password: process.env.POSTGRES_PASSWORD || "admin",
  port: process.env.POSTGRES_PASSWORD
    ? parseInt(process.env.POSTGRES_PASSWORD)
    : 5433,
};

export const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  logger.error("Postgres connection error", err);
});
