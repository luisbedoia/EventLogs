import { PoolConfig, Pool } from "pg";
import { logger } from "../utils/logger";

const poolConfig: PoolConfig = {
  user: "admin",
  host: "localhost",
  database: "admin",
  password: "admin",
  port: 5432,
};

export const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  logger.error("Postgres connection error", err);
});

