//import "dotenv/config";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, ".env.local") });
const USER = process.env.POSTGRES_USER;
const PASS = process.env.POSTGRES_PASSWORD;
const HOST = process.env.POSTGRES_HOST || "localhost";
const PORT = process.env.POSTGRES_PORT || "5432";
const DB = process.env.POSTGRES_DB;
const DB_URL = `postgresql://${USER}:${PASS}@${HOST}:${PORT}/${DB}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DB_URL,
  },
});
